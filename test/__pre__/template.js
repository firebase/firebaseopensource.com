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
const path = require("path");
const fs = require("fs");
const compile = require("vue-template-loader/lib/modules/template-compiler");

module.exports = {
  process(src, filename, config, options) {
    const template = fs.readFileSync(filename);
    const render = compile(template.toString());

    return `
module.exports = function withRender (_exports) {
  ${render.code}

  var options = typeof _exports === 'function'
  ? _exports.options
  : _exports;

  options.render = render
  options.staticRenderFns = staticRenderFns
  options.render = render;
  return _exports;
}
`;
  }
};
