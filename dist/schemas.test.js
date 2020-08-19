"use strict";

var _schemaMatching = _interopRequireDefault(require("./schema-matching"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var exampleObject = {
  a: 'a',
  b: 'b',
  c: 'c',
  d: null,
  e: {
    e1: 'e1',
    e2: 3,
    e3: function e3() {
      return 'e3';
    },
    e4: {
      e41: 'e41'
    }
  },
  f: false,
  g: null,
  h: 0,
  i: '',
  j: ['a', 2, {
    j1: {
      j12: 'j12'
    }
  }],
  k: [[{
    k1: 45
  }, {
    k2: 'wo'
  }], []]
};
var exampleSchema = {
  a: undefined,
  b: 'ciao',
  z: 'what',
  j: {
    j1: {
      j11: true,
      j12: 'hi'
    }
  },
  k: function k(_k) {
    return _k.map(function (arr) {
      return arr.map(function (elem) {
        return new _schemaMatching["default"](elem, {
          k1: 'k1',
          k2: 'k2'
        });
      });
    });
  }
};
describe('GET WITH SCHEMA', function () {
  it('Should respect schema', function () {
    var objWithSchema = new _schemaMatching["default"](exampleObject, exampleSchema);
    console.log(JSON.stringify(objWithSchema, null, 2));
  });
});