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

/**
 * Get the config and content for a single project and its subprojects.
 */
exports.getProject = functions.https.onRequest((request, response) => {
  const id = request.query.id;

  project
    .recursiveStoreProject(id)
    .then(() => {
      response.status(200).send(`Successfully retrieved ${id}.`);
    })
    .catch(e => {
      console.warn("Error:", e);
      response.status(500).send(`Failed to retrieve ${id}.`);
    });
});

/**
 * Get the config and content for all projects.
 *
 * Note: manually upped this function to 2GB memory and 360s timeout.
 */
exports.getAllProjects = functions.https.onRequest((request, response) => {
  project
    .storeAllProjects()
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
exports.pageRenderer = functions.https.onRequest(render.renderer);

/**
 * Manually fill Hosting cache with rendered pages
 */
exports.pagePrerender = functions.https.onRequest(render.prerender);
