const functions = require("firebase-functions");

/** Prototype */
const Config = function() {};

/**
 * Get a config key, either from the env or from local.
 */
Config.prototype.get = function(key) {
  try {
    return this._getNestedProperty(functions.config(), key);
  } catch (e) {
    console.warn("Config.get", e);
    const newKey = key.replace(".", "_");
    return process.env[newKey];
  }
};

Config.prototype._getNestedProperty = function(obj, name) {
  const pieces = name.split(".");
  let val = obj;
  pieces.forEach(piece => {
    val = val[piece];
  });

  return val;
};

/** Exports */
module.exports = new Config();
