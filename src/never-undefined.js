class _nu {
  constructor(target, realVal, isUndef) {
    this._target = target;
    // eslint-disable-next-line no-nested-ternary
    this._realVal = isUndef ? undefined : realVal === undefined ? target : realVal;

    const self = this;
    return new Proxy(self._target, {
      get(obj, prop) {
        if (prop === 'toValue') {
          return self.toValue;
        }
        if (prop === '_realVal') {
          return self._realVal;
        }
        if (prop === '_target') {
          return self._target;
        }

        if (obj[prop] === undefined) {
          return new _nu({}, undefined, true);
        }

        if (obj[prop] instanceof Function) {
          // maintain function context
          obj[prop] = obj[prop].bind(self._target);
        }

        if (obj[prop] instanceof Object) {
          return new _nu(obj[prop]);
        }

        return new _nu({}, obj[prop]);
      },
      set(obj, prop, newValue) {
        const WARN_MESSAGE = `Path not found. The value ${newValue} couldn't be set in ${prop}!`;
        if (self._realVal !== undefined) {
          try {
            self._realVal[prop] = newValue;
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn(WARN_MESSAGE);
          }
        } else {
          // eslint-disable-next-line no-console
          console.warn(WARN_MESSAGE);
        }
        return true;
      }
    });
  }

  toValue(defaultValue) {
    return this._realVal === undefined ? defaultValue : this._realVal;
  }
}

class _SchemaConstructor {
  constructor(obj, schema, matchingSchema) {
    if (obj === undefined || schema === undefined) {
      return matchingSchema;
    }

    for (const prop in schema) {
      if (Array.isArray(schema[prop])) {
        throw new Error('Cannot put arrays in schema. Just define them as objects');
      }

      if (obj[prop] === undefined) {
        matchingSchema[prop] = schema[prop];
        // eslint-disable-next-line no-continue
        continue;
      }

      if (Array.isArray(obj[prop])) {
        matchingSchema[prop] = obj[prop].map(
          subObj => new _SchemaConstructor(subObj, schema[prop], Array.isArray(subObj) ? [] : {})
        );
        // eslint-disable-next-line no-continue
        continue;
      }

      if (schema[prop] instanceof Object) {
        matchingSchema[prop] = new _SchemaConstructor(
          obj[prop],
          schema[prop],
          Array.isArray(schema[prop]) ? [] : {}
        );
        // eslint-disable-next-line no-continue
        continue;
      }

      matchingSchema[prop] = obj[prop];
    }
    return matchingSchema;
  }
}

class NeverUndefined {
  constructor(obj, schema) {
    let toReturn = obj;
    if (schema) {
      toReturn = new _SchemaConstructor(obj, schema, {});
    }

    return new _nu(toReturn);
  }
}

export default NeverUndefined;
