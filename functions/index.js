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
exports.getAllProjects = functions.https.onRequest((request, response) => {
  project
    .storeAllProjects()
    .then(() => {
      response.status(200).send(`Stored all projects!.`);
    })
    .catch(e => {
      console.warn("Error:", e);
      response.status(500).send(`Failed to store all projects.`);
    });
});
