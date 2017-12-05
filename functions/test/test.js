/**
 * TODO: Delete this file
 *
 * To run:
 * GCLOUD_PROJECT="fir-oss" github_token="<YOUR_GITHUB_TOKEN>" node test/test.js
 */
const project = require("../project");

const ids = [
  "samtstern::BotTest",
  "firebase::firebaseui-android",
  "firebase::firebaseui-ios",
  "firebase::angularfire",
  "firebase::functions-samples",
  "firebase::assistant-codelab"
];

ids.forEach(id => {
  return project.recursiveStoreProject(id).catch(err => {
    console.warn(err);
  });
});

// return project
//   .storeAllProjects()
//   .then(function() {
//     console.log("Done");
//   })
//   .catch(function(e) {
//     console.warn("Error", e);
//   });
