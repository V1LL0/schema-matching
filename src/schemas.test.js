import SM from './schema-matching';

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
  ],
  k: [
    [
      {
        k1: 45
      },
      {
        k2: 'wo'
      }
    ],
    []
  ]
};

const exampleSchema = {
  a: undefined,
  b: 'ciao',
  z: 'what',
  j: {
    j1: {
      j11: true,
      j12: 'hi'
    }
  },
  k: k =>
    k.map(arr =>
      arr.map(
        elem =>
          new SM(elem, {
            k1: 'k1',
            k2: 'k2'
          })
      )
    )
};

describe('GET WITH SCHEMA', () => {
  it('Should respect schema', () => {
    const objWithSchema = new SM(exampleObject, exampleSchema);
    console.log(JSON.stringify(objWithSchema, null, 2));
  });
});
