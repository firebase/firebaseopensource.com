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
import { Util } from "../../shared/util";
import { Timestamp } from "@google-cloud/firestore";
import { ProjectConfig, RepoMetadata, RepoRelease } from "../../shared/types";
import * as request from "request-promise-native";

const parselh = require("parse-link-header");
const urljoin = require("url-join");

export class Github {
  token: string;
  branch: string;

  constructor(token: string, branch: string) {
    this.token = token;
    this.branch = branch;
  }

  /**
   * Get the URL for the raw content for a page.
   */
  static getPageContentUrl(id: string, page: string, branch: string) {
    return urljoin(Github.getRawContentBaseUrl(id, branch), page);
  }

  /**
   * Get the raw.githubusercontent URL for a file
   */
  static getRawContentUrl(
    owner: string,
    repo: string,
    path: string,
    branch: string
  ): string {
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
  }

  /**
   * Get the githubusercontent base URL for a repo.
   */
  static getRawContentBaseUrl(id: string, branch: string) {
    // Parse the ID into pieces
    const idObj = Util.parseProjectId(id);

    // Get the URL to the root folder
    const pathPrefix = idObj.path ? `${idObj.path}/` : "";

    return Github.getRawContentUrl(idObj.owner, idObj.repo, pathPrefix, branch);
  }

  /**
   * Get the URL to the config for a particular project ID.
   */
  private static getConfigUrl(id: string, branch: string) {
    return urljoin(
      Github.getRawContentBaseUrl(id, branch),
      ".opensource/project.json"
    );
  }

  /**
   * Get the URL to the main content for a particular project ID.
   */
  private static getMainContentUrl(
    id: string,
    config: ProjectConfig,
    branch: string
  ) {
    // Path to content, relative to the project
    const contentPath = config.content;
    return urljoin(Github.getRawContentBaseUrl(id, branch), contentPath);
  }

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
  getRepoMetadata(org: string, repo: string): Promise<RepoMetadata> {
    const url = `https://api.github.com/repos/${org}/${repo}`;

    return request(url, this.getStandardOptions()).then(repo => {
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

    return request(url, this.getStandardOptions()).then(resp => {
      return resp.path;
    });
  }

  /**
   * Get recent releases for a GitHub repo
   */
  getRepoReleases(org: string, repo: string): Promise<RepoRelease[]> {
    const url = `https://api.github.com/repos/${org}/${repo}/releases`;
    return request(url, this.getStandardOptions()).then(resp => {
      return resp.map((release: any) => {
        return {
          org,
          repo,
          url: release.html_url,
          tag_name: release.tag_name,
          created_at: Timestamp.fromDate(new Date(release.created_at))
        };
      });
    });
  }

  /**
   * Read all of the pages from a Github API url and return them concatenated.
   */
  readAllPages(url: string, results: any[] = []): Promise<any[]> {
    const res = results ? results : [];

    var that = this;
    return request(url, this.getFullOptions()).then(response => {
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
   * Determine if the config for the given project exists.
   */
  hasProjectConfig(id: string): Promise<boolean> {
    return this.pageExists(Github.getConfigUrl(id, this.branch));
  }

  /**
   * Get project config as raw content.
   */
  getProjectConfig(id: string) {
    const url = Github.getConfigUrl(id, this.branch);
    return this.getRawContent(url);
  }

  /**
   * Get the raw content of a project's main content file.
   */
  getRawProjectContent(id: string, config: ProjectConfig) {
    const url = Github.getMainContentUrl(id, config, this.branch);
    return this.getRawContent(url);
  }

  /**
   * Get raw content from Github.
   * URL should be a raw.githubusercontent page.
   */
  getRawContent(url: string) {
    return request(url, this.getContentGetOptions());
  }

  /**
   * Issue a HEAD request to check if a page exists.
   * URL should be a raw.githubusercontent page.
   */
  pageExists(url: string): Promise<boolean> {
    return request(url, this.getContentHeadOptions())
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  private getStandardOptions() {
    const _GH_OPTIONS_STANDARD = {
      headers: {
        "user-agent": "node.js",
        Authorization: `token ${this.token}`
      },
      json: true
    };
    return _GH_OPTIONS_STANDARD;
  }

  private getFullOptions() {
    const _GH_OPTIONS_FULL = {
      headers: {
        "user-agent": "node.js",
        Authorization: `token ${this.token}`
      },
      json: true,
      resolveWithFullResponse: true
    };

    return _GH_OPTIONS_FULL;
  }

  private getContentHeaders() {
    const _GH_CONTENT_HEADERS = {
      "Cache-Control": "max-age=0",
      Authorization: `token ${this.token}`
    };

    return _GH_CONTENT_HEADERS;
  }

  private getContentHeadOptions() {
    const _GH_OPTIONS_CONTENT_HEAD = {
      method: "HEAD",
      headers: this.getContentHeaders
    };

    return _GH_OPTIONS_CONTENT_HEAD;
  }

  private getContentGetOptions() {
    const _GH_OPTIONS_CONTENT_GET = {
      headers: this.getContentHeaders()
    };

    return _GH_OPTIONS_CONTENT_GET;
  }
}
