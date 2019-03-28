import { Env } from "./types";

export class Util {

  static contentPath(id: string, env: Env = Env.PROD) {
    if (env == Env.STAGING) {
      return `/content-staging/${Util.normalizeId(id)}`;
    } else {
      return `/content/${Util.normalizeId(id)}`;
    }
  }

  static configPath(id: string, env: Env = Env.PROD) {
    if (env == Env.STAGING) {
      return `/configs-staging/${Util.normalizeId(id)}`;
    } else {
      return `/configs/${Util.normalizeId(id)}`;
    }
  }

  /**
   * Make sure all IDs have the same casing, etc.f
   */
  static normalizeId(id: string): string {
    return id.toLowerCase();
  }

  /**
   * Convert a path with slashes to a slug.
   */
  static pathToSlug(path: string): string {
    return this.normalizeId(path.replace(/\//g, "::"));
  }

  /**
   * Parse a project ID slug into {owner,repo,path}.
   */
  static parseProjectId(id: string) {
    const sections = id.split("::");

    if (sections.length < 2) {
      throw `Invalid project id: ${id}`;
    }

    const owner = sections[0];
    const repo = sections[1];

    let path = undefined;
    if (sections.length > 2) {
      const pathSections = sections.slice(2, sections.length);
      path = pathSections.join("/");
    }

    return {
      owner,
      repo,
      path
    };
  }
}
