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
import { ProjectConfig, PageSection, ProjectPage } from "../../shared/types";

import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

const cjson = require("comment-json");

const content = new Content();
const github = new Github(Config.get("github.token"));

// Initialize the Admin SDK with the right credentials for the environment
try {
  admin.initializeApp(functions.config().firebase);
} catch (e) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

export class Project {
  /**
   * Get a list of all project IDs, useful for fan-out project storing.
   */
  listAllProjectIds = async function() {
    // Loads ADDITIONAL_PROJECTS
    await Config.loadGlobalConfig();

    const repos = await github.listAllRepos("firebase");
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
  };

  /**
   * Store a project and all of its pages.
   */
  recursiveStoreProject(id: string) {
    Logger.debug(id, "recursiveStoreProject()");

    return Config.loadGlobalConfig()
      .then(() => {
        return this.getProjectConfig(id);
      })
      .then(config => {
        // Store this project's config and content
        const storeConfig = this.storeProjectConfig(id, config);
        const storeContent = this.storeProjectContent(id, config);
        const storeReleases = this.storeProjectReleases(id);

        // Wait for both to complete then pass on config
        return Promise.all([storeConfig, storeContent]);
      })
      .catch(e => {
        Logger.error(id, "recursiveStoreProject: ", e);
      });
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
    const url = Github.getConfigUrl(id);
    const idParsed = Util.parseProjectId(id);

    return this.checkConfigExists(id)
      .then((exists: boolean) => {
        if (exists) {
          // Config exists, fetch and parse it
          return github.getContent(url).then(data => {
            // Parse and remove comments
            const contents = data.toString();
            return cjson.parse(contents, null, true);
          });
        } else {
          // If the project has no config, make one up
          Logger.debug(id, "WARN: Using default config.");
          return github
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

        // Merge the config with repo metadata like stars
        // and updated time.
        return github
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
   * Check if the config exists for a given project.
   */
  checkConfigExists(id: string) {
    const url = Github.getConfigUrl(id);
    return github.pageExists(url);
  }

  /**
   * Fetch a project config and put it into Firestore.
   */
  storeProjectConfig(id: string, config: ProjectConfig) {
    const data = config;
    const docId = Util.normalizeId(id);

    // Add server timestamp
    data.last_fetched = admin.firestore.FieldValue.serverTimestamp();

    Logger.debug(id, `Storing at /configs/${docId}`);
    Logger.debug(id, "Config: " + JSON.stringify(config));
    const configProm = db
      .collection("configs")
      .doc(docId)
      .set(data);

    return configProm;
  }

  async storeProjectReleases(id: string): Promise<any> {
    const { owner, repo } = Util.parseProjectId(id);
    const releases = await github.getRepoReleases(owner, repo);
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
    const contentRef = db.collection("content").doc(Util.normalizeId(id));

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
    const url = Github.getContentUrl(id, config);

    return github
      .getContent(url)
      .then(data => {
        return content.processMarkdown(data, id, undefined, config);
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
    if (!config.pages || Object.keys(config.pages).length == 0) {
      Logger.debug(id, `Project has no extra pages.`);
      return Promise.resolve([]);
    }

    Logger.debug(id, `Getting page content for extra pages.`);

    const promises: Promise<void>[] = [];
    const pages: ProjectPage[] = [];

    // Loop through pages, get content for each
    Object.keys(config.pages).forEach(page => {
      const pageUrl = Github.getPageUrl(id, page);
      Logger.debug(id, `Rendering page: ${pageUrl}`);

      const pagePromise = github
        .getContent(pageUrl)
        .catch(e => {
          throw `Failed to get content for ${pageUrl}: ${JSON.stringify(e)}`;
        })
        .then(data => {
          return content.processMarkdown(data, id, page, config);
        })
        .then(sections => {
          pages.push({
            name: page,
            content: sections
          });
        });

      promises.push(pagePromise);
    });

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
