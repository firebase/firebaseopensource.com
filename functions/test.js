/**
 * TODO: Delete this file
 */
const project = require("./project");

const ids = [
  "samtstern::BotTest",
  "firebase::firebaseui-android",
  "firebase::angularfire",
  "firebase::functions-samples"
];

ids.forEach(id => {
  return project.recursiveStoreProject(id).catch(err => {
    console.warn(err);
  });
});
