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
// GCLOUD_PROJECT="fir-oss" github_token="<YOUR_GITHUB_TOKEN>" node test/test.js
import { Project } from "../project";

const project = new Project();

const ids = [
  "samtstern::BotTest",
  "firebase::quickstart-js",
  "firebase::quickstart-cpp",
  "firebase::firebaseui-android",
  "firebase::firebaseui-ios",
  "firebase::angularfire",
  "firebase::functions-samples",
  "firebase::assistant-codelab",
  "firebase::androiddrawing",
  "googlesamples::easypermissions"
];

project.loadGlobalConfig().then(() => {
  ids.forEach(id => {
    return project.recursiveStoreProject(id).catch(err => {
      console.warn(err);
    });
  });
});
