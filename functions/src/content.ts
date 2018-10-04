import { Config } from "./config";
import { Github } from "./github";
import { Logger } from "./logger";
import { Util } from "./util";
import { ProjectConfig } from "./types";

import * as cheerio from "cheerio";
import * as path from "path";
import * as url from "url";

const urljoin = require("url-join");

const log = new Logger();

export class Content {
  /**
   * Sanitize the content Html.
   */
  sanitizeHtml(
    repoId: string,
    page: string,
    config: ProjectConfig,
    html: string
  ) {
    // Links
    // * Links to page content files should go to our page
    // * Links to source files should go to github
    //
    // Images
    // * Images and other things should be made into githubusercontent links
    // * Remove badges

    let pageDir = "";
    if (page) {
      const lastSlash = page.lastIndexOf("/");
      pageDir = page.substring(0, lastSlash);
      if (lastSlash >= 0) {
        pageDir = page.substring(0, lastSlash);
      }
    }

    const renderedBaseUrl = urljoin(
      this.getRenderedContentBaseUrl(repoId),
      pageDir
    );
    const rawBaseUrl = urljoin(Github.getRawContentBaseUrl(repoId), pageDir);

    const $: CheerioStatic = cheerio.load(html);

    // Resolve all relative links to github
    const that = this;
    $("a").each((_: number, el: CheerioElement) => {
      const href = el.attribs["href"];
      if (!href) {
        return;
      }

      if (that._isGithubLink(href)) {
        // Convert github.com/org/foo links to firebaseopensource links
        const hrefUrl = url.parse(href);

        const pathSegments = hrefUrl.pathname
          .split("/")
          .filter((seg: string) => seg.trim().length > 0);

        if (pathSegments.length == 2) {
          const org = pathSegments[0];
          const repo = pathSegments[1];

          if (!that._isIncludedProject(org, repo)) {
            return;
          }

          const newLink = "/projects/" + pathSegments.join("/") + "/";

          log.debug(repoId, `Replacing ${href} with ${newLink}.`);
          el.attribs["href"] = newLink.toLowerCase();
        }
      }

      if (that._isRelativeLink(href)) {
        // Check if the link is to a page within the repo
        const repoRelative = path.join(pageDir, href);
        if (config.pages && config.pages[repoRelative]) {
          log.debug(repoId, `Lowercasing relative link ${repoRelative}.`);
          that.lowercaseLink(el);
        } else {
          that.sanitizeRelativeLink(el, "href", renderedBaseUrl);
        }
      }
    });

    // Resolve all relative images, add class to parent
    $("img").each((_: number, el: CheerioElement) => {
      const src = el.attribs["src"];
      if (!src) {
        return;
      }

      const badgeKeywords = [
        "travis-ci.org",
        "shields.io",
        "coveralls.io",
        "badge.fury.io",
        "gitter.im",
        "circleci.com",
        "opencollective.com",
        "cirrus-ci.com"
      ];

      let isBadge = false;
      badgeKeywords.forEach(word => {
        if (src.indexOf(word) >= 0) {
          isBadge = true;
        }
      });

      if (isBadge) {
        // Mark Badges
        $(el).addClass("img-badge");
      } else {
        // Add the image-parent class to the parent
        $(el)
          .parent()
          .addClass("img-parent");
      }

      that.sanitizeRelativeLink(el, "src", rawBaseUrl);
    });

    return $.html();
  }

  /**
   * Get the base github URL for a project.
   */
  getRenderedContentBaseUrl(id: string) {
    // Parse the ID into pieces
    const idObj = Util.parseProjectId(id);

    // Get the URL to the root folder
    const pathPrefix = idObj.path ? idObj.path + "/" : "";
    const url = `https://github.com/${idObj.owner}/${idObj.repo}/tree/master/${
      pathPrefix
    }`;

    return url;
  }

  /**
   * Sanitize relative links to be absolute.
   */
  sanitizeRelativeLink(el: CheerioElement, attrName: string, base: string) {
    const val = el.attribs[attrName];

    if (val) {
      const valUrl = url.parse(val);

      if (this._isRelativeLink(val)) {
        const newVal = urljoin(base, val);
        el.attribs[attrName] = newVal.toLowerCase();
      }
    }
  }

  /**
   * Change href to lowercase.
   */
  lowercaseLink(el: CheerioElement) {
    const newVal = el.attribs["href"].toLowerCase();
    el.attribs["href"] = newVal;
  }

  /**
   * Determine if a project is listed on firebaseopensource.com
   */
  _isIncludedProject(org: string, repo: string) {
    if (org === "firebase") {
      return true;
    }

    if (Config.ADDITIONAL_PROJECTS.indexOf(`${org}::${repo}`) >= 0) {
      return true;
    }

    return false;
  }

  /**
   * Determine if a link is to github.com
   */
  _isGithubLink(href: string) {
    const hrefUrl = url.parse(href);
    return (
      hrefUrl.hostname && hrefUrl.pathname && href.indexOf("github.com") >= 0
    );
  }

  /**
   * Determine if a link is relative.
   */
  _isRelativeLink(href: string) {
    const hrefUrl = url.parse(href);

    // Relative link has a pathname but not a host
    return !hrefUrl.host && hrefUrl.pathname;
  }
}
