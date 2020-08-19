"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _SchemaConstructor = function _SchemaConstructor(obj, schema, matchingSchema) {
  _classCallCheck(this, _SchemaConstructor);

  if (obj === undefined || schema === undefined) {
    return matchingSchema;
  }

  var keys = Object.keys(schema);

  var _loop = function _loop(i) {
    var prop = keys[i];

    if (typeof schema[prop] === 'function') {
      matchingSchema[prop] = schema[prop](obj[prop]);
      return "continue";
    }

    if (Array.isArray(schema[prop])) {
      throw new Error('Cannot put arrays in schema. Just define them as objects/functions');
    }

    if (obj[prop] === undefined) {
      matchingSchema[prop] = schema[prop];
      return "continue";
    }

    if (Array.isArray(obj[prop])) {
      if (schema[prop] instanceof Object) {
        matchingSchema[prop] = obj[prop].map(function (subObj) {
          if (subObj === undefined) {
            return schema[prop];
          }

          if (subObj instanceof Object) {
            return new _SchemaConstructor(subObj, schema[prop], Array.isArray(subObj) ? [] : {});
          }

          return subObj;
        });
        return "continue";
      } else {
        // in case schema[prop] is just a value, we don't need to go deep in the array. Just return the whole thing
        matchingSchema[prop] = obj[prop].slice();
        return "continue";
      }
    }

    if (schema[prop] instanceof Object) {
      matchingSchema[prop] = new _SchemaConstructor(obj[prop], schema[prop], Array.isArray(schema[prop]) ? [] : {});
      return "continue";
    }

    matchingSchema[prop] = obj[prop];
  };

  for (var i = 0; i < keys.length; i++) {
    var _ret = _loop(i);

    if (_ret === "continue") continue;
  }

  return matchingSchema;
};

module.exports = function SchemaMatching(obj, schema) {
  _classCallCheck(this, SchemaMatching);

  return new _SchemaConstructor(obj, schema, {});
};