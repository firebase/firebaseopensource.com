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
var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: "./src/main.ts",
  output: {
    path: path.resolve(__dirname, "./dist"),
    publicPath: "/dist/",
    filename: "build.js"
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: "vue-template-loader",
        options: {
          scoped: true,
          transformToRequire: {
            // The key should be element name,
            // the value should be attribute name or its array
            img: "src"
          }
        }
      },
      // We needed to split the rule for .scss files across two rules
      {
        // The loaders that compile to css (postcss and sass in this case) should be left as normal loaders
        test: /\.scss$/,
        use: ["sass-loader"]
      },
      {
        // The loaders that format css for webpack consumption should be post loaders
        enforce: "post",
        test: /\.scss$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]?[hash]"
        }
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js", ".vue", ".json"],
    alias: {
      vue$: "vue/dist/vue.esm.js"
    },
    plugins: [
      {
        apply: function(resolver) {
          resolver.plugin("resolve", function(fn, next) {
            if (fn.request.endsWith("template.html")) {
              fn.request += "?style=./style.scss";
            }
            next();
          });
        }
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    proxy: {
      "/__/**": {
        target: "http://localhost:5000/",
        secure: false
      }
    }
  },
  performance: {
    hints: "warning"
  },
  devtool: "#eval-source-map"
};

if (process.env.NODE_ENV === "production") {
  module.exports.devtool = "#source-map";
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"production"'
      }
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: true,
    //   compress: {
    //     warnings: false
    //   }
    // }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
}
