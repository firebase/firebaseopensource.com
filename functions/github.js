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
const config = require("./config");
const request = require("request-promise-native");
const parselh = require("parse-link-header");

const _GH_OPTIONS_STANDARD = {
  headers: {
    "user-agent": "node.js",
    Authorization: `token ${config.get("github.token")}`
  },
  json: true
};

const _GH_OPTIONS_FULL = {
  headers: {
    "user-agent": "node.js",
    Authorization: `token ${config.get("github.token")}`
  },
  json: true,
  resolveWithFullResponse: true
};

/** Prototype */
const Github = function() {};

/**
 * List the full name of all repos of a github org.
 */
Github.prototype.listAllRepos = function(org) {
  const url = `https://api.github.com/orgs/${org}/repos?per_page=1000`;

  return this.readAllPages(url).then(data => {
    return data.map(repo => {
      return repo.full_name;
    });
  });
};

/**
 * Get metadata for a github repo.
 */
Github.prototype.getRepoMetadata = function(org, repo) {
  const url = `https://api.github.com/repos/${org}/${repo}`;

  return request(url, _GH_OPTIONS_STANDARD).then(repo => {
    return {
      description: repo.description,
      fork: repo.fork,
      stars: repo.stargazers_count,
      last_updated: repo.updated_at
    };
  });
};

/**
 * Read all of the pages from a Github API url and return them concatenated.
 */
Github.prototype.readAllPages = function(url, results) {
  const res = results ? results : [];

  var that = this;
  return request(url, _GH_OPTIONS_FULL).then(response => {
    const data = response.body;
    const headers = response.headers;

    const newResults = res.concat(data);

    if (headers.link) {
      const linkHeader = parselh(headers.link);
      if (linkHeader.next) {
        return that.readAllPages(linkHeader.next.url, newResults);
      } else {
        return newResults;
      }
    }
  });
};

module.exports = new Github();
