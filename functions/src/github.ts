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
import { Config } from "./config";
import * as request from "request-promise-native";
const parselh = require("parse-link-header");

const config = new Config();

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

const _GH_CONTENT_HEADERS = {
  "Cache-Control": "max-age=0",
  Authorization: `token ${config.get("github.token")}`
};

const _GH_OPTIONS_CONTENT_GET = {
  headers: _GH_CONTENT_HEADERS
};

const _GH_OPTIONS_CONTENT_HEAD = {
  method: "HEAD",
  headers: _GH_CONTENT_HEADERS
};

export class Github {
  /**
   * List the full name of all repos of a github org.
   */
  listAllRepos(org: string): Promise<string[]> {
    const url = `https://api.github.com/orgs/${org}/repos?per_page=1000`;

    return this.readAllPages(url).then(data => {
      return data.map(repo => {
        return repo.full_name;
      });
    });
  }

  /**
   * Get metadata for a github repo.
   */
  getRepoMetadata(org: string, repo: string): Promise<any> {
    const url = `https://api.github.com/repos/${org}/${repo}`;

    return request(url, _GH_OPTIONS_STANDARD).then(repo => {
      return {
        description: repo.description,
        fork: repo.fork,
        stars: repo.stargazers_count,
        last_updated: repo.pushed_at
      };
    });
  }

  /**
   * Get README file name for a Github repo.
   */
  getRepoReadmeFile(org: string, repo: string): Promise<string> {
    const url = `https://api.github.com/repos/${org}/${repo}/readme`;

    return request(url, _GH_OPTIONS_STANDARD).then(resp => {
      return resp.path;
    });
  }

  /**
   * Read all of the pages from a Github API url and return them concatenated.
   */
  readAllPages(url: string, results: any[] = []): Promise<any[]> {
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
      } else {
        return newResults;
      }
    });
  }

  /**
   * Get the raw.githubusercontent URL for a file
   */
  getRawContentUrl(owner: string, repo: string, path: string): string {
    return `https://raw.githubusercontent.com/${owner}/${repo}/master/${path}`;
  }

  /**
   * Get raw content from Github.
   * URL should be a raw.githubusercontent page.
   */
  getContent(url: string) {
    return request(url, _GH_OPTIONS_CONTENT_GET);
  }

  /**
   * Issue a HEAD request to check if a page exists.
   * URL should be a raw.githubusercontent page.
   */
  pageExists(url: string): Promise<boolean> {
    return request(url, _GH_OPTIONS_CONTENT_HEAD)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }
}
