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
import { Project } from "./project";
import * as functions from "firebase-functions";

const PubSub = require("@google-cloud/pubsub");

const project = new Project();

const pubsubClient = new PubSub({
  projectId: process.env.GCLOUD_PROJECT
});

const RUNTIME_OPTS = {
  timeoutSeconds: 540,
  memory: "2GB" as "2GB"
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
 * Webhook version of {@link getProject}, useful for calling with `curl`.
 * Expects an "id" url param for a project ID.
 */
exports.getProjectWebhook = functions
  .runWith(RUNTIME_OPTS)
  .https.onRequest(async (request, response) => {
    const id = request.param("id");
    project
      .recursiveStoreProject(id)
      .then(() => {
        response.status(200).send(`Stored project ${id}.\n`);
      })
      .catch(e => {
        console.warn(e);
        response.status(500).send(`Failed to store project ${id}: ${e}.\n`);
      });
  });

/**
 * Get the config and content for all projects.
 */
exports.getAllProjects = functions
  .runWith(RUNTIME_OPTS)
  .https.onRequest(async (request, response) => {
    let allIds = await project.listAllProjectIds();

    const publisher = pubsubClient.topic("get-project").publisher();
    const promises: Promise<any>[] = [];

    allIds.forEach((id: string) => {
      const data = { id };
      const dataBuffer = Buffer.from(JSON.stringify(data));
      promises.push(publisher.publish(dataBuffer));
    });

    try {
      await Promise.all(promises);
      response.status(200).send("Stored all projects!\n");
    } catch (e) {
      console.warn("Error:", e);
      response.status(500).send("Failed to store all projects.\n");
    }
  });
