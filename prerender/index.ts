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

import * as admin from "firebase-admin";
import * as fetch from 'isomorphic-fetch';
import { minify } from 'html-minifier';
import * as fs from 'fs-extra';
import * as chalk from 'chalk';
import * as cheerio from "cheerio";

admin.initializeApp({
  projectId: "fir-oss",
  credential: admin.credential.applicationDefault()
});

admin.firestore().settings({timestampsInSnapshots: true});

const RENDERTON_URL = 'http://localhost:3000';
const BASE_URL = 'http://localhost:8080';
const BUILD_PATH = "/usr/local/google/home/abehaskins/Development/fosdc";

(async () => {
  const pages: string[] = [
    "",
    "platform/all",
    "platform/ios",
    "platform/android",
    "platform/web",
    "platform/games"
  ];
  const contentCollectionSnapshot = await admin.firestore().collection("content").get();

  await Promise.all(contentCollectionSnapshot.docs.map(async (pageSnapshot) => {
    const repoPath = `projects/${getPath(pageSnapshot.id)}`;
    pages.push(repoPath);

    const pagesCollectionSnapshot = await pageSnapshot.ref.collection("pages").get();
    pagesCollectionSnapshot.docs.forEach((subpageSnapshot) => {
      pages.push(`${repoPath}/${getPath(subpageSnapshot.id)}`);
    });
  }));

  for (var index in pages) {
    const pagePath = pages[index];
    const pageUrl = `${RENDERTON_URL}/render/${BASE_URL}/${pagePath}`;
    console.log(pageUrl);
    const res = await fetch(pageUrl);
    const $ = cheerio.load(await res.text());

    $("a").each(function() {
      var old_src=$(this).attr("href") || "";
      var new_src = old_src.toLowerCase();
      $(this).attr("href", new_src);
    });

    $("base").remove();

    const minHtml = minify($.html(), {
      minifyCSS: true,
      collapseWhitespace: true
    });
    fs.mkdirpSync(`${BUILD_PATH}/${pagePath}`)
    fs.writeFileSync(`${BUILD_PATH}/${pagePath}/index.html`, minHtml, 'utf8');
    console.log(chalk.default.greenBright(`Wrote: ${BUILD_PATH}/${pagePath}/index.html`));
  }

  console.log(JSON.stringify(pages, undefined, 2));
})();

function getPath(id: string) {
  return id.replace(/::/g, "/");
}