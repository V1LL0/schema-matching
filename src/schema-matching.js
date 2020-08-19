class _SchemaConstructor {
  constructor(obj, schema, matchingSchema) {
    if (obj === undefined || schema === undefined) {
      return matchingSchema;
    }

    const keys = Object.keys(schema);
    for (let i = 0; i < keys.length; i++) {
      const prop = keys[i];

      if (typeof schema[prop] === 'function') {
        matchingSchema[prop] = schema[prop](obj[prop]);
        continue;
      }

      if (Array.isArray(schema[prop])) {
        throw new Error('Cannot put arrays in schema. Just define them as objects/functions');
      }

      if (obj[prop] === undefined) {
        matchingSchema[prop] = schema[prop];
        continue;
      }

      if (Array.isArray(obj[prop])) {
        if (schema[prop] instanceof Object) {
          matchingSchema[prop] = obj[prop].map(subObj => {
            if (subObj === undefined) {
              return schema[prop];
            }
            if (subObj instanceof Object) {
              return new _SchemaConstructor(subObj, schema[prop], Array.isArray(subObj) ? [] : {});
            }
            return subObj;
          });
          continue;
        } else {
          // in case schema[prop] is just a value, we don't need to go deep in the array. Just return the whole thing
          matchingSchema[prop] = obj[prop].slice();
          continue;
        }
      }

      if (schema[prop] instanceof Object) {
        matchingSchema[prop] = new _SchemaConstructor(
          obj[prop],
          schema[prop],
          Array.isArray(schema[prop]) ? [] : {}
        );
        continue;
      }

      matchingSchema[prop] = obj[prop];
    }
    return matchingSchema;
  }
}

module.exports = class SchemaMatching {
  constructor(obj, schema) {
    return new _SchemaConstructor(obj, schema, {});
  }
};
