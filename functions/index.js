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
 * Note: manually upped this function to 2GB memory and 360s timeout.
 */
exports.getAllConfigs = functions.https.onRequest((request, response) => {
  // TODO: Support repos outside of firebase
  return github.listAllRepos("firebase").then(function(repos) {
    var promises = [];

    repos.forEach(repo => {
      // TODO: Make this a function so we can reuse it
      const id = repo.replace("/", "::");
      const promise = project.checkConfigExists(id).then(exists => {
        if (exists) {
          console.log(`Found config for ${id}!`);
          return project.recursiveStoreProject(id);
        } else {
          console.log(`No config exists for ${id}`);
        }
      });

      promises.push(promise);
    });

    return Promise.all(promises);
  });
});
