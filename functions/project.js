const admin = require("firebase-admin");
const cheerio = require("cheerio");
const cjson = require("comment-json");
const functions = require("firebase-functions");
const fs = require("fs");
const marked = require("marked");
const request = require("request-promise-native");
const url = require("url");
const urljoin = require("url-join");

const GH_CONTENT_OPTIONS = {
  headers: {
    "Cache-Control": "max-age=0"
  }
};

// Initialize the Admin SDK with the right credentials for the environment
try {
  admin.initializeApp(functions.config().firebase);
} catch (e) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

// Initialize marked with options
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false
});

const db = admin.firestore();

/** Prototype */
const Project = function() {};

/**
 * Store a project and all of its subprojects.
 */
Project.prototype.recursiveStoreProject = function(id) {
  console.log(`recursiveStoreProject(${id})`);

  const promises = [];

  const that = this;
  return this.getProjectConfig(id).then(config => {
    // Store this project
    promises.push(that.storeProjectConfig(id, config));
    promises.push(that.storeProjectContent(id, config));

    // Recurse on each subproject
    if (config.subprojects) {
      config.subprojects.forEach(sub => {
        const slug = that.pathToSlug(sub);
        const storePromise = that.recursiveStoreProject(`${id}::${slug}`);

        promises.push(storePromise);
      });
    }

    // Wait for all to complete
    return Promise.all(promises);
  });
};

/**
 * Convert a path with slashes to a slug.
 */
Project.prototype.pathToSlug = function(path) {
  return path.replace("/", "::");
};

/**
 * Get the configuration for a project at a certain path.
 */
Project.prototype.getProjectConfig = function(id) {
  const url = this.getConfigUrl(id);

  const that = this;
  return this.checkConfigExists(id).then(exists => {
    if (exists) {
      // Config exists, fetch and parse it
      return request(url, GH_CONTENT_OPTIONS).then(data => {
        // Parse and remove comments
        const contents = data.toString();
        return cjson.parse(contents, null, true);
      });
    } else {
      // If the project has no config, make one up
      const idParsed = that.parseProjectId(id);

      console.log(`WARN: Using default config for ${id}`);
      return {
        name: idParsed.repo,
        type: "library",
        content: "README.md"
      };
    }
  });
};

/**
 * Check if the config exists for a given project.
 */
Project.prototype.checkConfigExists = function(id) {
  const url = this.getConfigUrl(id);

  // TODO: This should be a HEAD request for efficiency
  return request(url)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

/**
 * Get the githubusercontent base URL for a repo.
 */
Project.prototype.getRawContentBaseUrl = function(id) {
  // Parse the ID into pieces
  const idObj = this.parseProjectId(id);

  // Get the URL to the root folder
  const pathPrefix = idObj.path ? idObj.path + "/" : "";
  const url = `https://raw.githubusercontent.com/${idObj.owner}/${
    idObj.repo
  }/master/${pathPrefix}`;

  return url;
};

/**
 * Get the base github URL for a project.
 */
Project.prototype.getRenderedContentBaseUrl = function(id) {
  // Parse the ID into pieces
  const idObj = this.parseProjectId(id);

  // Get the URL to the root folder
  const pathPrefix = idObj.path ? idObj.path + "/" : "";
  const url = `https://github.com/${idObj.owner}/${idObj.repo}/tree/master/${
    pathPrefix
  }`;

  return url;
};

/**
 * Get the URL to the config for a particular project ID.
 */
Project.prototype.getConfigUrl = function(id) {
  return urljoin(this.getRawContentBaseUrl(id), ".opensource/project.json");
};

/**
 * Get the URL to the content for a particular project ID.
 */
Project.prototype.getContentUrl = function(id, config) {
  // Path to content, relative to the project
  const contentPath = config.content;
  return urljoin(this.getRawContentBaseUrl(id), contentPath);
};

/**
 * Get the URL for the raw content for a page.
 */
Project.prototype.getPageUrl = function(id, page) {
  return urljoin(this.getRawContentBaseUrl(id), page);
};

/**
 * Fetch a project config and put it into Firestore.
 */
Project.prototype.storeProjectConfig = function(id, config) {
  const data = this.arraysToMaps(config);

  // TODO: should we make the ID lowercase before writing?
  const configProm = db
    .collection("configs")
    .doc(id)
    .set(data);
};

/**
 * Fetch a project's content and put it into Firestore.
 */
Project.prototype.storeProjectContent = function(id, config) {
  var that = this;
  const contentRef = db.collection("content").doc(id);
  return this.getProjectContent(id, config)
    .then(sections => {
      // Set main content
      return contentRef.set(sections);
    })
    .then(() => {
      // Set all pages in subcollection
      return that.getProjectPagesContent(id, config).then(content => {
        if (!content || !content.pages) {
          return;
        }

        const batch = db.batch();

        content.pages.forEach(page => {
          const slug = that.pathToSlug(page.name);
          const ref = contentRef.collection("pages").doc(slug);

          batch.set(ref, {
            content: page.content
          });
        });

        return batch.commit();
      });
    });
};

/**
 * Fetch a project's content.
 */
Project.prototype.getProjectContent = function(id, config) {
  const url = this.getContentUrl(id, config);

  var that = this;
  return request(url, GH_CONTENT_OPTIONS)
    .then(data => {
      return marked(data);
    })
    .then(html => {
      return that.sanitizeHtml(id, config, html);
    })
    .then(html => {
      return that.htmlToSections(html);
    });
};

/**
 * Get the content for all pages of a project.
 * 
 * TODO: Store this in a sanitized, structured format.
 */
Project.prototype.getProjectPagesContent = function(id, config) {
  if (!config.pages) {
    console.log(`Project ${id} has no extra pages.`);
    return Promise.resolve({});
  }

  console.log(`Getting page content for project ${id}`);

  promises = [];
  pages = [];

  // Loop through pages, get content for each
  const that = this;
  config.pages.forEach(page => {
    const pageUrl = that.getPageUrl(id, page);
    console.log(`Rendering page: ${pageUrl}`);

    const pagePromise = request(pageUrl, GH_CONTENT_OPTIONS)
      .then(data => {
        return marked(data);
      })
      .then(html => {
        // TODO: Sanitize
        pages.push({
          name: page,
          content: html
        });
      });

    promises.push(pagePromise);
  });

  return Promise.all(promises).then(() => {
    return {
      pages
    };
  });
};

/**
 * Sanitize the content Html.
 */
Project.prototype.sanitizeHtml = function(id, config, html) {
  // Links
  // * (TODO) Links to subprojects content files should go to our page
  // * (DONE) Links to source files should go to github
  //
  // Images
  // * (TODO) Images and other things should be made into githubusercontent links
  const baseUrl = this.getRenderedContentBaseUrl(id);

  const $ = cheerio.load(html);
  const sections = [];

  // Resolve all relative links to github
  $("a").each((_, el) => {
    const href = el.attribs["href"];

    if (href) {
      const hrefUrl = url.parse(href);

      // Relative link has a pathname but not a host
      if (!hrefUrl.host && hrefUrl.pathname) {
        const newHref = urljoin(baseUrl, href);
        el.attribs["href"] = newHref;
      }
    }
  });

  return $.html();
};

/**
 * Turn HTML into a sections object.
 *
 * TODO: sanitize links and images.
 */
Project.prototype.htmlToSections = function(html) {
  const $ = cheerio.load(html);
  const sections = [];

  $("h2").each((_, el) => {
    let $sibchils = $("div", "<div></div>");

    $(el)
      .nextUntil("h2")
      .each((_, el) => {
        $sibchils = $sibchils.append(el);
      });

    sections.push({
      name: $(el).text(),
      content: $sibchils.html()
    });
  });

  return { sections };
};

/**
 * Takes an object and returns a new object with all array properties converted to
 * maps to booleans.
 *
 * Assumes no nested arrays.
 */
Project.prototype.arraysToMaps = function(obj) {
  const newobj = {};

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key].constructor === Array) {
        const arr = obj[key];
        const map = {};

        arr.forEach(item => {
          map[item] = true;
        });

        newobj[key] = map;
      } else {
        newobj[key] = obj[key];
      }
    }
  }

  return newobj;
};

/**
 * Parse a project ID slug into {owner,repo,path}.
 */
Project.prototype.parseProjectId = function(id) {
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
};

module.exports = new Project();
