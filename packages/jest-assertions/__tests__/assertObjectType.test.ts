import * as Assertions from '../src';

it('assertObjectType (single-property)', () => {
  type T = {
    a: string;
  };
  const assertion = <const>{ a: Assertions.t.string };
  expect(
    Assertions.assertObjectType<T>({ a: 'test' }, assertion).pass,
  ).toBeTruthy();
  expect(Assertions.assertObjectType<T>({} as any, assertion).pass).toBeFalsy();
  expect(
    Assertions.assertObjectType<T>({ a: 0 } as any, assertion).pass,
  ).toBeFalsy();
  expect(Assertions.assertObjectType<T>(null, assertion).pass).toBeFalsy();
  expect(Assertions.assertObjectType<T>(null, assertion).message()).toBe(
    'null is not an object\nExpected types: {"a":"string"}',
  );
});
it('assertObjectType (multi-property)', () => {
  type T = {
    a: string;
    b: boolean;
    c: number;
  };
  const assertion = <const>{
    a: Assertions.t.string,
    b: Assertions.t.boolean,
    c: Assertions.t.number,
  };
  expect(
    Assertions.assertObjectType<T>({ a: 'test', b: true, c: 0 }, assertion)
      .pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>({ a: null, b: true, c: 0 } as any, assertion)
      .pass,
  ).toBeFalsy();
});
it('assertObjectType (nested object)', () => {
  type T = {
    a: string;
    b: {
      aNested: string;
      bNested: number;
    };
    c: number;
  };
  const assertion = <const>{
    a: Assertions.t.string,
    b: {
      aNested: Assertions.t.string,
      bNested: Assertions.t.number,
    },
    c: Assertions.t.number,
  };
  expect(
    Assertions.assertObjectType<T>(
      {
        a: 'test',
        b: {
          aNested: 'test',
          bNested: 0,
        },
        c: 0,
      },
      assertion,
    ).pass,
  ).toBeTruthy();
});
it('assertObjectType (unions)', () => {
  type T = {
    a: string | null;
  };
  const assertion = {
    a: Assertions.union<Assertions.t.null | Assertions.t.string>([
      Assertions.t.null,
      Assertions.t.string,
    ]),
  };
  expect(
    Assertions.assertObjectType<T>({ a: null }, assertion).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>({ a: 'test' }, assertion).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>({ a: 0 as any }, assertion).pass,
  ).toBeFalsy();
  expect(
    Assertions.assertObjectType<T>({ a: 0 as any }, assertion).message(),
  ).toBe(
    'Property "a" does not match with the union type: (null | string)\nGot: 0',
  );
});
it('assertObjectType (unions w/ nested object)', () => {
  type T = {
    a?: {
      b: string;
      c?: string | null;
    };
  };
  const assertion = {
    a: Assertions.union([
      Assertions.t.undefined,
      {
        b: Assertions.t.string as const,
        c: Assertions.union<
          Assertions.t.null | Assertions.t.string | Assertions.t.undefined
        >([Assertions.t.null, Assertions.t.string, Assertions.t.undefined]),
      },
    ] as const),
  };
  expect(
    Assertions.assertObjectType<T>(
      {
        a: {
          b: '',
          c: null,
        },
      },
      assertion,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: {
          b: '',
        },
      },
      assertion,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: {
          b: '',
          c: undefined,
        },
      },
      assertion,
    ).pass,
  ).toBeTruthy();
  expect(Assertions.assertObjectType<T>({}, assertion).pass).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: {
          b: Assertions.t.string,
          c: 0 as any,
        },
      },
      assertion,
    ).pass,
  ).toBeFalsy();
});
it('assertObjectType (deeply nested object)', () => {
  type T = {
    a: {
      b: {
        c: {
          d: {
            e: {
              f?: string;
            };
          };
        };
      };
    };
  };
  const assertion = {
    a: {
      b: {
        c: {
          d: {
            e: {
              f: Assertions.union<Assertions.t.string | Assertions.t.undefined>(
                [Assertions.t.string, Assertions.t.undefined],
              ),
            },
          },
        },
      },
    },
  };
  expect(
    Assertions.assertObjectType<T>(
      {
        a: {
          b: {
            c: {
              d: {
                e: {
                  f: '',
                },
              },
            },
          },
        },
      },
      assertion,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: {
          b: {
            c: {
              d: {
                e: {
                  f: undefined,
                },
              },
            },
          },
        },
      },
      assertion,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: {
          b: {
            c: {
              d: {
                e: {},
              },
            },
          },
        },
      },
      assertion,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: {
          b: {
            c: {
              d: {
                e: {
                  f: 0 as any,
                },
              },
            },
          },
        },
      },
      assertion,
    ).pass,
  ).toBeFalsy();
});
it('assertObjectType (array)', () => {
  type T = {
    a: string[];
  };
  const assertion = {
    a: Assertions.list<Assertions.t.string>([Assertions.t.string]),
  };
  expect(
    Assertions.assertObjectType<T>({ a: [''] }, assertion).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>({ a: [] }, assertion).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>({ a: [0] as any }, assertion).pass,
  ).toBeFalsy();
  expect(
    Assertions.assertObjectType<T>({ a: [0] as any }, assertion).message(),
  ).toBe(
    'Property "a" has elements that violate the type: string[]\nFound: [0]',
  );
  expect(
    Assertions.assertObjectType<T>({ a: 1 as any }, assertion).pass,
  ).toBeFalsy();
  expect(
    Assertions.assertObjectType<T>({ a: 1 as any }, assertion).message(),
  ).toBe('Property "a" does not match with the type: string[]');
});
it('assertObjectType (array of objects)', () => {
  type T = {
    a: { b: string | null }[];
  };
  const assertion = {
    a: Assertions.list([
      {
        b: Assertions.union<Assertions.t.string | Assertions.t.null>([
          Assertions.t.null,
          Assertions.t.string,
        ]),
      },
    ]),
  };
  expect(
    Assertions.assertObjectType<T>({ a: [{ b: null }] }, assertion).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      { a: [{ b: null }, { b: '' }, { b: '' }] },
      assertion,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      { a: [{ b: null }, { b: '' }, { b: '' }, undefined as any] },
      assertion,
    ).pass,
  ).toBeFalsy();
  expect(
    Assertions.assertObjectType<T>({ a: [{ b: 0 as any }] }, assertion).pass,
  ).toBeFalsy();
});
it('assertObjectType (2d array)', () => {
  type T = {
    a: number[][];
  };
  const assertion = {
    a: Assertions.list([
      Assertions.list<Assertions.t.number>([Assertions.t.number]),
    ]),
  };
  expect(
    Assertions.assertObjectType<T>(
      {
        a: [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
      },
      assertion,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: [
          [1, 2, 3],
          [4, '' as any, 6],
          [7, 8, 9],
        ],
      },
      assertion,
    ).pass,
  ).toBeFalsy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: [[], [], []],
      },
      assertion,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: [],
      },
      assertion,
    ).pass,
  ).toBeTruthy();
});
it('assertObjectType (union array)', () => {
  type T = {
    a: (number | null)[];
  };
  const assertion = {
    a: Assertions.list<Assertions.t.number | Assertions.t.null>([
      Assertions.t.number,
      Assertions.t.null,
    ]),
  };
  expect(
    Assertions.assertObjectType<T>(
      {
        a: [0, 10, null],
      },
      assertion,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: [],
      },
      assertion,
    ).pass,
  ).toBeTruthy();
});
it('assertObjectType (union 2d array)', () => {
  type T = {
    a: (number | null | number[])[];
  };
  const assertion = {
    a: Assertions.list<
      | Assertions.t.number
      | Assertions.List<Assertions.t.number>
      | Assertions.t.null
    >([
      Assertions.t.number,
      Assertions.t.null,
      Assertions.list([Assertions.t.number]),
    ]),
  };
  expect(
    Assertions.assertObjectType<T>(
      {
        a: [0, 10, [1, 4, 5]],
      },
      assertion,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: [[1, 4, 5], [1], []],
      },
      assertion,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: [],
      },
      assertion,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: [[1, 4, 5], [1], [undefined as any]],
      },
      assertion,
    ).pass,
  ).toBeFalsy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: [undefined as any],
      },
      assertion,
    ).pass,
  ).toBeFalsy();
});
it('assertObjectType (union 2d array of unions)', () => {
  type T = {
    a: (number | null | (number | null)[])[];
  };
  const assertion = <const>{
    a: Assertions.list<
      | Assertions.t.number
      | Assertions.t.null
      | Assertions.List<Assertions.t.number | Assertions.t.null>
    >([
      Assertions.t.number,
      Assertions.t.null,
      Assertions.list([Assertions.t.number, Assertions.t.null]),
    ]),
  };
  expect(
    Assertions.assertObjectType<T>(
      {
        a: [10, 20, 30, null, [1, 2, null]],
      },
      assertion,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: [[]],
      },
      assertion,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: [],
      },
      assertion,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: [[1, 2, 3, 4]],
      },
      assertion,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: [[1, null, 3, null]],
      },
      assertion,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: [[1, 2, 3, 4, undefined as any]],
      },
      assertion,
    ).pass,
  ).toBeFalsy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: [[1, 2, 3, 4], undefined as any],
      },
      assertion,
    ).pass,
  ).toBeFalsy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: [[1, 2, 3, 4], undefined as any],
      },
      assertion,
    ).message(),
  ).toBe(
    'Property "a" has elements that violate the type: (number | null | (number | null)[])[]\nFound: [undefined]',
  );
  expect(
    Assertions.assertObjectType<T>(
      {
        a: [undefined as any],
      },
      assertion,
    ).pass,
  ).toBeFalsy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: [[undefined] as any],
      },
      assertion,
    ).pass,
  ).toBeFalsy();
});
it('assertObjectType (union of constants)', () => {
  type T = {
    a: 'high' | 'medium' | 'low';
    b?: 'primary';
  };
  const assertion = <const>{
    a: Assertions.union<T['a']>(['high', 'medium', 'low']),
    b: Assertions.union([
      'primary',
      Assertions.t.undefined,
    ]) as Assertions.JSType<T['b']>,
  };
  expect(
    Assertions.assertObjectType<T>(
      {
        a: 'high',
        b: 'primary',
      },
      assertion,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: 'invalid' as any,
        b: 'primary',
      },
      assertion,
    ).pass,
  ).toBeFalsy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: 'high',
      },
      assertion,
    ).pass,
  ).toBeTruthy();
});
it('assertObjectType (array of union objects)', () => {
  type T = {
    a: ({ b: string | number } | null | undefined)[];
  };
  const assertion: Assertions.JSType<T> = <const>{
    a: Assertions.list([
      Assertions.t.undefined,
      Assertions.t.null,
      {
        b: Assertions.union<Assertions.t.string | Assertions.t.number>([
          Assertions.t.string,
          Assertions.t.number,
        ]),
      },
    ]),
  };
  expect(
    Assertions.assertObjectType<T>(
      {
        a: [null, undefined, { b: 'hello world' }, { b: 0 }],
      },
      assertion,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: [null, undefined, { b: 'hello world' }, { b: 0 }, {} as any],
      },
      assertion,
    ).pass,
  ).toBeFalsy();
});
it('assertObjectType (error message matches #1)', () => {
  type T = {
    a: string;
  };
  expect(
    Assertions.assertObjectType<T>(
      { a: false as any },
      { a: Assertions.t.string },
    ).message(),
  ).toBe('Property "a" does not match with the type: string\nGot: false');
  expect(
    Assertions.assertObjectType<T>(
      { a: { b: 'hello' } as any },
      { a: Assertions.t.string },
    ).message(),
  ).toBe(
    'Property "a" does not match with the type: string\nGot: {"b":"hello"}',
  );
});
it('assertObjectType (error message matches #2)', () => {
  type T = {
    a: { b?: string | null };
  };
  const assertion = <const>{
    a: {
      b: Assertions.union<
        Assertions.t.string | Assertions.t.null | Assertions.t.undefined
      >([Assertions.t.string, Assertions.t.undefined, Assertions.t.null]),
    },
  };
  const type = JSON.stringify({
    b: '(string | undefined | null)',
  });
  expect(
    Assertions.assertObjectType<T>({ a: false as any }, assertion).message(),
  ).toBe(`Property "a" does not match with the type: ${type}\nGot: false`);
  expect(
    Assertions.assertObjectType<T>(
      { a: { b: false } as any },
      assertion,
    ).message(),
  ).toBe(
    `Property "a" does not match with the type: ${type}\nGot: {"b":false}`,
  );
});
it('assertObjectType (error message matches #3)', () => {
  type T = {
    a: {
      b?: string | null;
      c?: {
        d?: number;
      };
    };
  };
  const assertion = <const>{
    a: {
      b: Assertions.union<
        Assertions.t.string | Assertions.t.null | Assertions.t.undefined
      >([Assertions.t.string, Assertions.t.undefined, Assertions.t.null]),
      c: Assertions.union<
        Assertions.t.undefined | Assertions.JSType<Required<T['a']>>['c']
      >([
        Assertions.t.undefined,
        {
          d: Assertions.union<Assertions.t.undefined | Assertions.t.number>([
            Assertions.t.number,
            Assertions.t.undefined,
          ]),
        },
      ]),
    },
  };
  const type = JSON.stringify({
    b: '(string | undefined | null)',
    c: `(undefined | ${JSON.stringify({
      d: '(number | undefined)',
    })})`,
  });
  expect(
    Assertions.assertObjectType<T>({ a: false as any }, assertion).message(),
  ).toBe(`Property "a" does not match with the type: ${type}\nGot: false`);
  expect(
    Assertions.assertObjectType<T>(
      { a: { b: false } as any },
      assertion,
    ).message(),
  ).toBe(
    `Property "a" does not match with the type: ${type}\nGot: {"b":false}`,
  );
});
it('assertObjectType (complex object)', () => {
  type T = {
    a: string[];
    b: number[];
    c: string;
    d: boolean;
    e: {
      f: (string | null)[];
      g: { status: 'OK' } | { status: 'ERROR'; error: string };
    };
  };
  const assertion: Assertions.JSType<T> = {
    a: Assertions.list([Assertions.t.string]),
    b: Assertions.list([Assertions.t.number]),
    c: Assertions.t.string,
    d: Assertions.t.boolean,
    e: {
      f: Assertions.list([Assertions.t.string, Assertions.t.null]),
      g: Assertions.union([
        { status: 'OK' },
        { status: 'ERROR', error: Assertions.t.string },
      ]),
    },
  };

  expect(
    Assertions.assertObjectType<T>(
      {
        a: [''],
        b: [100, 200],
        c: '',
        d: true,
        e: {
          f: ['hello', null, 'world'],
          g: { status: 'ERROR', error: 'random error message' },
        },
      },
      assertion,
    ).pass,
  ).toBeTruthy();

  expect(
    Assertions.assertObjectType<T>(
      {
        a: [''],
        b: [100, 200],
        c: '',
        d: true,
        e: {
          f: ['hello', null, 'world'],
        } as any,
      },
      assertion,
    ).pass,
  ).toBeFalsy();
});
it('assertObjectType (classes)', () => {
  class Foobar {
    private a: number;
    constructor(a: number) {
      this.a = a;
    }
    multiply(b: number) {
      this.a *= b;
    }
  }
  type T = {
    a: string;
    b: Foobar;
  };

  const assertion: Assertions.JSType<T> = {
    a: Assertions.t.string,
    b: Foobar,
  };
  expect(
    Assertions.assertObjectType<T>(
      {
        a: 'hello world',
        b: new Foobar(1),
      },
      assertion,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      {
        a: 'hello world',
        b: null as any,
      },
      assertion,
    ).pass,
  ).toBeFalsy();
});
it('assertObjectType (union array of classes)', () => {
  class Person {
    private readonly name: string;
    constructor(name: string) {
      this.name = name;
    }
  }
  class Student extends Person {
    private readonly classroom: string;
    constructor(name: string, classroom: string) {
      super(name);
      this.classroom = classroom;
    }
  }
  class Teacher extends Person {
    private readonly classroom: string;
    private readonly prefix?: 'Mr' | 'Ms' | 'Mrs';
    constructor(name: string, classroom: string, prefix?: 'Mr' | 'Ms' | 'Mrs') {
      super(name);
      this.prefix = prefix;
      this.classroom = classroom;
    }
  }
  class Parent extends Person {
    private readonly child: Student;
    constructor(name: string, child: Student) {
      super(name);
      this.child = child;
    }
  }
  const studentA = new Student('a', '1-A');
  const studentB = new Student('b', '1-A');
  const studentC = new Student('c', '1-A');
  const studentD = new Student('d', '1-B');
  const parentA = new Parent('Lewis', studentA);
  const parentB = new Parent('Steve', studentB);
  const parentC = new Parent('Lucy', studentB);
  const parentD = new Parent('Rosa', studentC);
  const parentE = new Parent('Alexis', studentD);
  const teacherA = new Teacher('Gary', '1-A', 'Mr');
  const teacherB = new Teacher('Mary', '1-A', 'Ms');
  type T = {
    users: Person[];
    teachers: Teacher[];
    students: Student[];
    classroom: (Teacher | Student)[];
  };
  const assertion: Assertions.JSType<T> = {
    students: Assertions.list([Student]),
    teachers: Assertions.list([Teacher]),
    users: Assertions.list([Person]),
    classroom: Assertions.list([Teacher, Student]),
  };
  expect(
    Assertions.assertObjectType<T>(
      {
        users: [
          studentA,
          studentB,
          studentC,
          studentD,
          parentA,
          parentB,
          parentC,
          parentD,
          parentE,
          teacherA,
          teacherB,
        ],
        teachers: [teacherA, teacherB],
        students: [studentA, studentB, studentC, studentD],
        classroom: [teacherA, teacherB, studentA, studentB, studentC, studentD],
      },
      assertion,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      {
        users: [
          studentA,
          studentB,
          studentC,
          studentD,
          parentA,
          parentB,
          parentC,
          parentD,
          parentE,
          teacherA,
          teacherB,
        ],
        teachers: [teacherA, teacherB],
        students: [studentA, studentB, studentC, studentD],
        classroom: [teacherA],
      },
      assertion,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertObjectType<T>(
      {
        users: [
          studentA,
          studentB,
          studentC,
          studentD,
          parentA,
          parentB,
          parentC,
          parentD,
          parentE,
          teacherA,
          teacherB,
        ],
        teachers: [teacherA, teacherB],
        students: [studentA, studentB, studentC, teacherB as any, studentD],
        classroom: [teacherA, teacherB, studentA, studentB, studentC, studentD],
      },
      assertion,
    ).pass,
  ).toBeFalsy();
});
