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
import { Github } from "./github";
import { defineSecret } from "firebase-functions/params";

export const githubToken = defineSecret("GITHUB_TOKEN");

export class Config {
  private static _github?: Github;

  // TODO: Dynamic branch
  static get github(): Github {
    if (!this._github) {
      this._github = new Github(Config.get("github.token"), "master");
    }
    return this._github;
  }

  static readonly FEATURED_BLACKLIST_PROJECTS_URL = Github.getRawContentUrl(
    "firebase",
    "firebaseopensource.com",
    "config/feature_blacklist_projects.json",
    "master",
  );

  static readonly ADDITIONAL_PROJECTS_URL = Github.getRawContentUrl(
    "firebase",
    "firebaseopensource.com",
    "config/additional_projects.json",
    "master",
  );

  static ADDITIONAL_PROJECTS: string[] = [];
  static FEATURED_BLACKLIST_PROJECTS: string[] = [];

  static async loadGlobalConfig() {
    if (
      this.ADDITIONAL_PROJECTS.length > 0 &&
      this.FEATURED_BLACKLIST_PROJECTS.length > 0
    ) {
      return;
    }

    const additionalData = await this.github.getRawContent(
      this.ADDITIONAL_PROJECTS_URL,
    );
    this.ADDITIONAL_PROJECTS = JSON.parse(additionalData).projects;

    const blacklistData = await this.github.getRawContent(
      this.FEATURED_BLACKLIST_PROJECTS_URL,
    );
    this.FEATURED_BLACKLIST_PROJECTS = JSON.parse(blacklistData).projects;
  }

  /**
   * Get a config key, either from the env or from local.
   */
  static get(key: string): string {
    if (key === "github.token") {
      return process.env.github_token || githubToken.value();
    }
    return process.env[key.replace(".", "_")] || "";
  }
}
