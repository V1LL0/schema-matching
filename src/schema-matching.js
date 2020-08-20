import cloneDeep from 'lodash.clonedeep';

const recursiveSchemaMatching = (obj, schema, result) => {
  if (obj === undefined) {
    return result;
  }

  const keys = Object.keys(schema);
  for (let i = 0; i < keys.length; i++) {
    const prop = keys[i];

    if (Array.isArray(schema[prop])) {
      throw new Error('Cannot put arrays in schema. Just define them as objects/functions');
    }

    if (typeof schema[prop] === 'function') {
      result[prop] = schema[prop](obj[prop]);
      continue;
    }

    if (schema[prop] instanceof Object) {
      result[prop] = recursiveSchemaMatching(
        obj[prop] === undefined ? {} : obj[prop],
        schema[prop],
        {}
      );
      continue;
    }

    // If schema[prop] is not a function && is not an object,
    // we consider it safe to just assign it
    if (obj[prop] === undefined) {
      result[prop] = schema[prop];
      continue;
    }

    // obj[prop] can be anything.
    // Schema[prop] is a value, but obj[prop] is not undefined.
    // We need to deep copy obj[prop]
    result[prop] = cloneDeep(obj[prop]);
  }
  return result;
};

module.exports = (obj, schema) => recursiveSchemaMatching(obj, schema, {});
