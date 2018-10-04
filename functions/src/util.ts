export class Util {
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
