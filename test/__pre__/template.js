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
