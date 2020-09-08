"use strict";

var _lodash = _interopRequireDefault(require("lodash.clonedeep"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var recursiveSchemaMatching = function recursiveSchemaMatching(obj, schema, result) {
  if (obj === undefined) {
    return result;
  }

  var keys = Object.keys(schema);

  var _loop = function _loop(i) {
    var prop = keys[i];

    if (Array.isArray(schema[prop])) {
      throw new Error('Cannot put arrays in schema. Just define them as objects/functions');
    }

    if (typeof schema[prop] === 'function') {
      result[prop] = schema[prop](obj[prop]);
      return "continue";
    }

    if (schema[prop] instanceof Object) {
      result[prop] = Array.isArray(obj[prop]) ? obj[prop].map(function (el) {
        return recursiveSchemaMatching(el === undefined ? {} : el, schema[prop], {});
      }) : recursiveSchemaMatching(obj[prop] === undefined ? {} : obj[prop], schema[prop], {});
      return "continue";
    } // If schema[prop] is not a function && is not an object,
    // we consider it safe to just assign it


    if (obj[prop] === undefined) {
      result[prop] = schema[prop];
      return "continue";
    } // obj[prop] can be anything.
    // Schema[prop] is a value, but obj[prop] is not undefined.
    // We need to deep copy obj[prop]


    result[prop] = (0, _lodash["default"])(obj[prop]);
  };

  for (var i = 0; i < keys.length; i++) {
    var _ret = _loop(i);

    if (_ret === "continue") continue;
  }

  return result;
};

module.exports = function (obj, schema) {
  return recursiveSchemaMatching(obj, schema, {});
};