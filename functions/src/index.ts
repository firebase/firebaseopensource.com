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
import { Cron } from "./cron";
import { Env, GetParams } from "../../shared/types";
import { Util } from "../../shared/util";

const PubSub = require("@google-cloud/pubsub");

const pubsubClient = new PubSub({
  projectId: process.env.GCLOUD_PROJECT
});

const RUNTIME_OPTS = {
  timeoutSeconds: 540,
  memory: "2GB" as "2GB"
};

const DEFAULT_PARAMS: GetParams = {
  env: Env.PROD,
  branch: "master"
};

// TODO: This should be created per-function with
//       dynamic params.
const project = new Project(DEFAULT_PARAMS);

/**
 * Stage a project.
 *
 * Params: org, repo, branch
 */
exports.stageProject = functions
  .runWith(RUNTIME_OPTS)
  .https.onRequest(async (request, response) => {
    const org = request.param("org");
    const repo = request.param("repo");
    const branch = request.param("branch") || "master";
    console.log(`stageProject(${org}, ${repo}, ${branch})`);

    const p = new Project({
      env: Env.STAGING,
      branch
    });

    const id = Util.normalizeId(`${org}::${repo}`);
    try {
      await p.recursiveStoreProject(id);
      response
        .status(200)
        .send(
          `Visit https://firebaseopensource.com/projects-staging/${org}/${repo}`
        );
    } catch (e) {
      console.warn(e);
      response.status(500).send(`Failed to stage project: ${e}.\n`);
    }
  });

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
    // TODO: This should just send the PubSub
    const id = request.query["id"];

    try {
      await project.recursiveStoreProject(id);
      response.status(200).send(`Stored project ${id}.\n`);
    } catch (e) {
      console.warn(e);
      response.status(500).send(`Failed to store project ${id}: ${e}.\n`);
    }
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

exports.cloudBuild = functions
  .runWith(RUNTIME_OPTS)
  .https.onRequest(async (request, response) => {
    try {
      await Cron.build();
      response.status(200).send("Build started!");
    } catch (e) {
      console.warn("Error: ", e);
      response.status(500).send("Failed to start build.");
    }
  });
