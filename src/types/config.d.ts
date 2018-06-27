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

import FirestoreAppModule = require("@firebase/firestore-types");

export interface TrueMap {
  [s: string]: true;
}

export interface Subprojects {
  auth: boolean;
  database: boolean;
  firestore: boolean;
  storage: boolean;
}

export interface Config {
  content?: string;
  last_updated?: string;
  last_updated_from_now?: string;
  name?: string;
  pages?: TrueMap;
  parent?: string;
  platforms?: TrueMap;
  related?: TrueMap;
  stars?: number;
  subprojects?: Subprojects;
  tags?: TrueMap;
  type?: string;
  letter?: string;
  color?: string;
  repo?: string;
  org?: string;
  description?: string;
  last_fetched?: FirestoreAppModule.Timestamp;
  last_fetched_from_now?: string;
}
