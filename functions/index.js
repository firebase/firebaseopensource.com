const functions = require("firebase-functions");
const github = require("./github");
const project = require("./project");

/**
 * Get the config and content for a single project and its subprojects.
 */
exports.getProject = functions.https.onRequest((request, response) => {
  const id = request.query.id;

  project
    .recursiveStoreProject(id)
    .then(() => {
      response.status(200).send(`Successfully retrieved ${id}.`);
    })
    .catch(e => {
      console.warn("Error:", e);
      response.status(500).send(`Failed to retrieve ${id}.`);
    });
});

/**
 * Get the config for all projects.
 *
 * TODO: get around rate limiting by adding some auth.
 * See https://developer.github.com/v3/#rate-limiting
 *
 * Note: manually upped this function to 2GB memory and 360s timeout.
 */
exports.getAllProjects = functions.https.onRequest((request, response) => {
  // TODO: Support repos outside of firebase
  return github.listAllRepos("firebase").then(function(repos) {
    var promises = [];

    const ids = repos.map(repo => {
      // TODO: Make this a function so we can reuse it
      return repo.replace("/", "::");
    });

    // Run in batches
    return _batchRun(project.recursiveStoreProject.bind(project), ids, 5);
  });
});

/**
 * Run a function over arguments in batches.
 */
const _batchRun = function(fn, args, batchSize) {
  var promises = [];

  const n = Math.min(batchSize, args.length);
  if (n == 0) {
    return;
  }

  for (let i = 0; i < n; i++) {
    const p = fn(args[i]);
    promises.push(p);
  }

  return Promise.all(promises)
    .catch(console.warn)
    .then(() => {
      const newArgs = args.slice(n);
      return _batchRun(fn, newArgs, batchSize);
    });
};
