/**
 * TODO: Delete this file
 */
const project = require("./project");

const ids = [
  "samtstern::BotTest",
  "firebase::firebaseui-android",
  "firebase::angularfire"
];

ids.forEach(id => {
  return project.recursiveStoreProject(id).catch(err => {
    console.warn(err);
  });
});
