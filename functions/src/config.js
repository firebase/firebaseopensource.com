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

/** Prototype */
const Config = function() {};

/**
 * Get a config key, either from the env or from local.
 */
Config.prototype.get = function(key) {
  try {
    return this._getNestedProperty(functions.config(), key);
  } catch (e) {
    const newKey = key.replace(".", "_");
    return process.env[newKey];
  }
};

Config.prototype._getNestedProperty = function(obj, name) {
  const pieces = name.split(".");
  let val = obj;
  pieces.forEach(piece => {
    val = val[piece];
  });

  return val;
};

/** Exports */
module.exports = new Config();
