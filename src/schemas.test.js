import NU from './never-undefined';

const exampleObject = {
  a: 'a',
  b: 'b',
  c: 'c',
  d: null,
  e: {
    e1: 'e1',
    e2: 3,
    e3() {
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
  j: [
    'a',
    2,
    {
      j1: {
        j12: 'j12'
      }
    }
  ]
};

class TestClass {
  constructor() {
    this.testValue = 'testValue';
  }

  getValue() {
    return this.testValue;
  }
}

const exampleSchema = {
  a: undefined,
  b: 'ciao',
  z: 'what',
  j: {
    j1: {
      j11: true,
      j12: 'hi'
    }
  }
};

describe('GET WITH SCHEMA', () => {
  it('Should respect schema', () => {
    const objWithSchema = new NU(exampleObject, exampleSchema);
    console.log(JSON.stringify(objWithSchema.toValue(), null, 2));
  });
});
