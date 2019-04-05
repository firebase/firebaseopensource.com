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

// TODO: Delete this file
//
// To run:
// GCLOUD_PROJECT="fir-oss" github_token="<YOUR_GITHUB_TOKEN>" ts-node test/test.ts
import { Config } from "../config";
import { Project } from "../project";
import { GetParams, Env } from "../../../shared/types";

const DEFAULT_PARAMS: GetParams = {
  env: Env.STAGING,
  branch: "master"
};

const project = new Project(DEFAULT_PARAMS);

const ids = [
  "samtstern::BotTest",
  "firebase::quickstart-js",
  "firebase::quickstart-cpp",
  "firebase::firebaseui-android",
  "firebase::angularfire",
  "firebase::functions-samples",

  // Interesting because:
  //  * Is "blacklisted" from being featured
  "firebase::androiddrawing",

  // Interesting because:
  //  * Uses a nested md file as it's "content" page.
  "firebase::firebase-android-sdk",

  // Interesting because:
  //  * Non-Firebase
  //  * Has "old-style" pages config (no names)
  "invertase::react-native-firebase"
];

Config.loadGlobalConfig().then(() => {
  ids.forEach(id => {
    return project.recursiveStoreProject(id).catch(err => {
      console.warn(err);
    });
  });
});
