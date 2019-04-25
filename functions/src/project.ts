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
import { Content } from "./content";
import { Github } from "./github";
import { Logger } from "./logger";
import { Util } from "../../shared/util";
import {
  ProjectConfig,
  PageSection,
  ProjectPage,
  Env,
  GetParams,
  PageConfig
} from "../../shared/types";

import * as admin from "firebase-admin";

const cjson = require("comment-json");

try {
  admin.initializeApp();
} catch (e) {
  Logger.error("initialize", "Could not initialize firebase-admin", e);
}

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

export class Project {
  params: GetParams;
  github: Github;

  constructor(params: GetParams) {
    this.params = params;
    this.github = new Github(Config.get("github.token"), params.branch);
  }

  /**
   * Get a list of all project IDs, useful for fan-out project storing.
   */
  async listAllProjectIds() {
    // Loads ADDITIONAL_PROJECTS
    await Config.loadGlobalConfig();

    const repos = await this.github.listAllRepos("firebase");
    const ids = repos.map(repo => {
      return Util.pathToSlug(repo);
    });

    Logger.debug("listAllProjectIds", `Number of base projects: ${ids.length}`);
    Logger.debug(
      "listAllProjectIds",
      `Additional Projects: ${Config.ADDITIONAL_PROJECTS}`
    );
    const allIds = ids.concat(Config.ADDITIONAL_PROJECTS);
    return allIds;
  }

  /**
   * Store a project and all of its pages.
   */
  async recursiveStoreProject(id: string): Promise<any> {
    Logger.debug(id, "recursiveStoreProject()");

    try {
      await Config.loadGlobalConfig();
      const config = await this.getProjectConfig(id);

      // Store this project's config and content
      await this.storeProjectConfig(id, config);
      await this.storeProjectContent(id, config);

      // Only store releases in production
      if (this.params.env == Env.PROD) {
        await this.storeProjectReleases(id);
      }
    } catch (e) {
      Logger.error(id, "recursiveStoreProject: ", e);
    }
  }

  /**
   * Guess the platforms for a project.
   */
  inferPlatforms(id: string) {
    const platforms: any = {
      ios: ["ios", "objc", "swift", "apple"],
      android: ["android", "kotlin"],
      web: ["web", "js", "angular", "react"],
      games: ["cpp", "unity"]
    };

    const result: any = {};

    for (let key in platforms) {
      const keywords = platforms[key] as string[];
      keywords.forEach(keyword => {
        if (id.indexOf(keyword) >= 0) {
          result[key] = true;
        }
      });
    }

    return result;
  }

  /**
   * Get the configuration for a project at a certain path.
   */
  getProjectConfig(id: string) {
    const idParsed = Util.parseProjectId(id);

    return this.github
      .hasProjectConfig(id)
      .then((exists: boolean) => {
        if (exists) {
          // Config exists, fetch and parse it
          return this.github.getProjectConfig(id).then(data => {
            // Parse and remove comments
            const contents = data.toString();
            return cjson.parse(contents, null, true);
          });
        } else {
          // If the project has no config, make one up
          Logger.debug(id, "WARN: Using default config.");
          return this.github
            .getRepoReadmeFile(idParsed.owner, idParsed.repo)
            .then((readme: string) => {
              Logger.debug(id, `README: ${readme}`);
              return {
                name: idParsed.repo,
                type: "library",
                content: readme
              };
            });
        }
      })
      .then(config => {
        // Add inferred platforms
        if (!config.platforms) {
          config.platforms = this.inferPlatforms(id);
        }

        // Consult the feature blacklist
        if (Config.FEATURED_BLACKLIST_PROJECTS.indexOf(id) >= 0) {
          config.blacklist = true;
        } else {
          config.blacklist = false;
        }

        // Normalize the formatting of "pages"
        if (config.pages) {
          const normalizedPages: PageConfig[] = [];

          if (Array.isArray(config.pages)) {
            // In v0 pages was just an array of paths
            for (const path of config.pages) {
              normalizedPages.push({
                path
              });
            }
          } else {
            // In v1 it is a map of { path: title }
            Object.keys(config.pages).forEach((path: string) => {
              const name = config.pages[path];
              normalizedPages.push({
                name,
                path
              });
            });
          }

          config.pages = normalizedPages;
        }

        // Merge the config with repo metadata like stars
        // and updated time.
        return this.github
          .getRepoMetadata(idParsed.owner, idParsed.repo)
          .then(meta => {
            if (meta.description) {
              config.description = meta.description;
            }

            config.fork = meta.fork;
            config.stars = meta.stars;
            config.last_updated = meta.last_updated;

            return config;
          });
      })
      .then(config => {
        return this.sanitizeForStorage(config);
      });
  }

  /**
   * Fetch a project config and put it into Firestore.
   */
  storeProjectConfig(id: string, config: ProjectConfig) {
    const data = config;
    const docId = Util.normalizeId(id);

    // Add server timestamp
    data.last_fetched = admin.firestore.FieldValue.serverTimestamp();

    // Get path to the config document in the database
    const configPath = Util.configPath(docId, this.params.env);

    Logger.debug(id, `Storing at ${configPath}`);
    Logger.debug(id, "Config: " + JSON.stringify(config));

    return db.doc(configPath).set(data);
  }

  async storeProjectReleases(id: string): Promise<any> {
    const { owner, repo } = Util.parseProjectId(id);
    const releases = await this.github.getRepoReleases(owner, repo);
    if (!releases || releases.length == 0) {
      Logger.debug(id, `No releases for ${id}`);
      return;
    }

    const batch = db.batch();
    for (const release of releases) {
      const releaseKey = `${id}::${release.tag_name}`;
      const ref = db.collection("releases").doc(releaseKey);
      batch.set(ref, release);
    }

    return batch.commit();
  }

  /**
   * Fetch a project's content and put it into Firestore.
   */
  async storeProjectContent(id: string, config: ProjectConfig): Promise<any> {
    const contentPath = Util.contentPath(id, this.params.env);
    const contentRef = db.doc(contentPath);

    const sections = await this.getProjectContent(id, config);

    // Set main content
    await contentRef.set(sections);

    // Set all pages in subcollection
    const content = await this.getProjectPagesContent(id, config);
    if (!content || content.length == 0) {
      return;
    }

    const batch = db.batch();

    content.forEach((page: ProjectPage) => {
      const slug = Util.pathToSlug(page.name);
      const ref = contentRef.collection("pages").doc(slug);

      Logger.debug(id, `Storing ${page.name} content at path ${ref.path}`);
      batch.set(ref, page.content);
    });

    return batch.commit();
  }

  /**
   * Fetch a project's content.
   */
  getProjectContent(id: string, config: ProjectConfig) {
    const content = new Content();
    return this.github
      .getRawProjectContent(id, config)
      .then(data => {
        return content.processMarkdown(
          data,
          id,
          config.content,
          config,
          this.params.branch
        );
      })
      .then(content => {
        content.sections = this.filterProjectSections(content.sections);
        return content;
      });
  }

  /**
   * Filter sections that are not useful when rendered.
   */
  filterProjectSections(sections: PageSection[]) {
    const blacklist = [
      "license",
      "licensing",
      "contribute",
      "contributing",
      "build status"
    ];

    return sections.filter(section => {
      if (!section.name) {
        return true;
      }

      for (let i = 0; i < blacklist.length; i++) {
        if (blacklist[i] === section.name.toLowerCase().trim()) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Get the content for all pages of a project.
   */
  getProjectPagesContent(
    id: string,
    config: ProjectConfig
  ): Promise<ProjectPage[]> {
    if (!config.pages || config.pages.length == 0) {
      Logger.debug(id, `Project has no extra pages.`);
      return Promise.resolve([]);
    }

    Logger.debug(id, `Getting page content for extra pages.`);

    const promises: Promise<void>[] = [];
    const pages: ProjectPage[] = [];

    // Loop through pages, get content for each
    const content = new Content();
    for (const page of config.pages) {
      const pageUrl = Github.getPageContentUrl(
        id,
        page.path,
        this.params.branch
      );
      Logger.debug(
        id,
        `Rendering page name=${page.name}, path=${page.path}, url=${pageUrl}`
      );

      const pagePromise = this.github
        .getRawContent(pageUrl)
        .catch(e => {
          throw `Failed to get content for ${pageUrl}: ${JSON.stringify(e)}`;
        })
        .then(data => {
          return content.processMarkdown(
            data,
            id,
            page.path,
            config,
            this.params.branch
          );
        })
        .then(sections => {
          pages.push({
            name: page.path,
            content: sections
          });
        });

      promises.push(pagePromise);
    }

    return Promise.all(promises).then(() => {
      return pages;
    });
  }

  /**
   * Sanitize a config for storage in Firestore.
   */
  sanitizeForStorage(obj: any) {
    let result = obj;

    try {
      result = this.arraysToMaps(result, ["platforms", "related"]);

      // TODO: Doing this does not work, because GitHub's content
      // API is not case insensitive.
      // result = this.lowercaseMapKeys(result);
    } catch (e) {
      console.warn("Could not sanitize: " + JSON.stringify(obj), e);
      throw e;
    }

    return result;
  }

  /**
   * For a given object, change all of the keys (recursively) to be lower case.
   */
  lowercaseMapKeys(obj: any) {
    if (obj && obj.constructor === Array) {
      // Array, convert each member
      const newArr: any[] = [];
      obj.forEach((item: any) => {
        newArr.push(this.lowercaseMapKeys(item));
      });

      return newArr;
    } else if (obj && obj.constructor === Object) {
      // JSON object, convert each member.
      const newObj: any = {};
      Object.keys(obj).forEach((key: string) => {
        const val = obj[key];
        const lowerKey = key.toLowerCase();

        newObj[lowerKey] = this.lowercaseMapKeys(val);
      });

      return newObj;
    }

    return obj;
  }

  /**
   * Takes an object and returns a new object with all array properties converted to
   * maps to booleans.
   *
   * Assumes no nested arrays.
   */
  arraysToMaps(obj: any, lowercase: string[] = []) {
    const newobj: any = {};

    Object.keys(obj).forEach(key => {
      const arr = obj[key];

      // Only sanitize if it's a non-empty
      // array of strings.
      if (
        arr &&
        arr.constructor === Array &&
        arr.length > 0 &&
        arr[0].constructor === String
      ) {
        const map: any = {};
        arr.forEach((item: any) => {
          // If requested, lowercase the item
          let itemKey;
          if (lowercase.indexOf(key) >= 0) {
            itemKey = item.toLowerCase();
          } else {
            itemKey = item;
          }

          map[itemKey] = true;
        });

        newobj[key] = map;
      } else {
        newobj[key] = obj[key];
      }
    });

    return newobj;
  }
}
