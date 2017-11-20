const functions = require("firebase-functions");

/** Prototype */
const Config = function() {};

/**
 * Get a config key, either from the env or from local.
 */
Config.prototype.get = function(key) {
  try {
    return functions.config()[key];
  } catch (e) {
    const newKey = key.replace(".", "_");
    return process.env[newKey];
  }
};

/** Exports */
module.exports = new Config();
