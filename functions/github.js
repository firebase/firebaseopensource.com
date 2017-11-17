const request = require("request-promise-native");
const parselh = require("parse-link-header");

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
 * Read all of the pages from a Github API url and return them concatenated.
 */
Github.prototype.readAllPages = function(url, results) {
  const res = results ? results : [];

  const options = {
    headers: { "user-agent": "node.js" },
    json: true,
    resolveWithFullResponse: true
  };

  var that = this;
  return request(url, options).then(response => {
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
