/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const functions = require("firebase-functions");
const github = require("./github");
const project = require("./project");
const render = require("./render");
const PubSub = require("@google-cloud/pubsub");

const pubsubClient = new PubSub({
  projectId: process.env.GCLOUD_PROJECT
});

const RUNTIME_OPTS = {
  timeoutSeconds: 540,
  memory: "2GB"
};

/**
 * Get the config and content for a single project and its subprojects.
 *
 * @param message.id the project ID to store.
 */
exports.getProject = functions
  .runWith(RUNTIME_OPTS)
  .pubsub.topic("get-project")
  .onPublish(message => {
    const id = message.json.id;
    return project.recursiveStoreProject(id);
  });

/**
 * Get the config and content for all projects.
 */
exports.getAllProjects = functions
  .runWith(RUNTIME_OPTS)
  .https.onRequest((request, response) => {
    project
      .listAllProjectIds()
      .then(allIds => {
        const publisher = pubsubClient.topic("get-project").publisher();
        const promises = [];

        allIds.forEach(id => {
          const data = { id };
          const dataBuffer = Buffer.from(JSON.stringify(data));
          promises.push(publisher.publish(dataBuffer));
        });

        return Promise.all(promises);
      })
      .then(() => {
        response.status(200).send("Stored all projects!.");
      })
      .catch(e => {
        console.warn("Error:", e);
        response.status(500).send("Failed to store all projects.");
      });
  });

/**
 * Render website pages
 */
exports.pageRenderer = functions
  .runWith(RUNTIME_OPTS)
  .https.onRequest(render.renderer);

/**
 * Manually fill Hosting cache with rendered pages
 */
exports.pagePrerender = functions
  .runWith(RUNTIME_OPTS)
  .https.onRequest(render.prerender);

exports.storeAllPagesHtml = functions
  .runWith(RUNTIME_OPTS)
  .https.onRequest((request, response) => {
    render.getAllPagePaths().then(function(pagePaths) {
      // TODO: Make a folder for each date
      const storagePath = "prod";
      const publisher = pubsubClient.topic("store-page-html").publisher();

      const promises = [];
      pagePaths.forEach(pagePath => {
        const data = {
          storagePath: storagePath,
          pagePath: "/" + pagePath
        };
        const dataBuffer = Buffer.from(JSON.stringify(data));

        promises.push(publisher.publish(dataBuffer));
      });

      Promise.all(promises)
        .then(() => {
          response.status(200).send("Done.");
        })
        .catch(e => {
          console.warn("Error:", e);
          response.status(500).send("Error.");
        });
    });
  });

/**
 * Pre-render a page as HTML and store the result in GCS.
 *
 * @param message.storagePath the folder path in GCS.
 * @param message.pagePath the page to render.
 */
exports.storePageHtml = functions
  .runWith(RUNTIME_OPTS)
  .pubsub.topic("store-page-html")
  .onPublish(message => {
    const storagePath = message.json.storagePath;
    const pagePath = message.json.pagePath;

    console.log(`storePageHtml(${storagePath}, ${pagePath})`);
    return render.renderToStorage(storagePath, pagePath);
  });
