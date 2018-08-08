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

const app = require("express")();
const fetch = require("isomorphic-fetch");
const minify = require("html-minifier").minify;
const cheerio = require("cheerio");
const admin = require("firebase-admin");

admin.firestore().settings({ timestampsInSnapshots: true });

var RENDERTRON_URL = "http://rt.firebaseopensource.com";
var APP_URL = "http://35.184.136.77/app";
var RENDERED_URL = "https://firebaseopensource.com";
var GA_TAG = `<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-110728272-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-110728272-1');
</script>
`;

function getRendererHTML(path) {
  const pageUrl = `${RENDERTRON_URL}/render/${APP_URL}${path}`;
  console.log(pageUrl);
  return fetch(pageUrl)
    .then(function(res) {
      return res.text();
    })
    .then(function(text) {
      const $ = cheerio.load(text);
      $("head").html($("head").html() + GA_TAG);

      $("a").each(function() {
        var old_src = $(this).attr("href") || "";

        if (!old_src.startsWith("http://") && !old_src.startsWith("https://")) {
          var new_src = old_src.toLowerCase();
          $(this).attr("href", new_src);
        }
      });

      $("base").remove();

      return minify($.html(), {
        minifyCSS: true,
        collapseWhitespace: true
      });
    });
}

app.use(function(req, res) {
  getRendererHTML(req.path).then(html => {
    res.send(html);
  });
});

exports.prerender = function(req, res) {
  getAllPagePaths()
    .then(function(pages) {
      console.log(pages);
      return Promise.all(
        pages.map(function(pagePath) {
          const url = `${RENDERED_URL}/${pagePath}`;
          console.log(`Prerendering ${url}`);
          return fetch(url);
        })
      );
    })
    .then(function() {
      res.json({ status: "ready" });
    });
};

exports.renderToStorage = function(storagePath, pagePath) {
  return getRendererHTML(pagePath).then(function(html) {
    const file = admin
      .storage()
      .bucket()
      .file(storagePath + pagePath + "/index.html");
    return file.save(html);
  });
};

function getAllPagePaths() {
  const pages = [
    "",
    "platform/all",
    "platform/ios",
    "platform/android",
    "platform/web",
    "platform/games"
  ];

  return admin
    .firestore()
    .collection("content")
    .get()
    .then(function(contentCollectionSnapshot) {
      return Promise.all(
        contentCollectionSnapshot.docs.map(pageSnapshot => {
          const repoPath = `projects/${getPath(pageSnapshot.id)}`;
          pages.push(repoPath);

          return pageSnapshot.ref
            .collection("pages")
            .get()
            .then(function(pagesCollectionSnapshot) {
              pagesCollectionSnapshot.docs.forEach(subpageSnapshot => {
                pages.push(`${repoPath}/${getPath(subpageSnapshot.id)}`);
              });
            });
        })
      );
    })
    .then(function() {
      return pages.map((page) => {
        return page.toLowerCase();
      });
    });
}

function getPath(id) {
  return id.replace(/::/g, "/");
}

exports.renderer = app;
exports.getAllPagePaths = getAllPagePaths;

if (require.main === module) {
  RENDERTRON_URL = "http://localhost:3000";
  APP_URL = "http://localhost:8080";
  GA_TAG = "";
  app.listen(5050, function() {
    console.log("Live on :5050");
  });
}
