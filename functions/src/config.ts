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
import * as functions from "firebase-functions";

class Config {
  /**
   * Get a config key, either from the env or from local.
   */
  get(key: string): string {
    try {
      return this._getNestedProperty(functions.config(), key);
    } catch (e) {
      const newKey = key.replace(".", "_");
      return process.env[newKey];
    }
  }

  _getNestedProperty(obj: any, name: string): string {
    const pieces = name.split(".");
    let val = obj;
    pieces.forEach(piece => {
      val = val[piece];
    });

    return val;
  }
}

module.exports = new Config();
