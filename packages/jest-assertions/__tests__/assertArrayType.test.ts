import * as Assertions from '../src';

it('assertArrayType (primitives only)', () => {
  expect(
    Assertions.assertArrayType([1, 2, 3], Assertions.t.number).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertArrayType(undefined, Assertions.t.number).pass,
  ).toBeFalsy();
  expect(
    Assertions.assertArrayType(undefined, Assertions.t.number).message(),
  ).toBe('Did not receive an array.\nExpected: number[]\nGot: undefined');
  expect(
    Assertions.assertArrayType(['hello', 'world'], Assertions.t.string).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertArrayType([true, false], Assertions.t.boolean).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertArrayType([{}, {}, {}], Assertions.t.object).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertArrayType([undefined, undefined], Assertions.t.undefined)
      .pass,
  ).toBeTruthy();
  expect(
    Assertions.assertArrayType(
      [],
      Assertions.t.string,
      Assertions.t.bigint,
      Assertions.t.boolean,
      Assertions.t.function,
      Assertions.t.number,
      Assertions.t.object,
      Assertions.t.symbol,
      Assertions.t.undefined,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertArrayType(['hello world'], Assertions.t.number).pass,
  ).toBeFalsy();
  expect(
    Assertions.assertArrayType(['hello world'], Assertions.t.number).message(),
  ).toBe('List does not match type\nExpected: number[]\nGot: ["hello world"]');
});
it('assertArrayType (union)', () => {
  expect(
    Assertions.assertArrayType(
      [1, '', null, undefined, false, {}],
      Assertions.t.number,
      null,
      Assertions.t.string,
      undefined,
      Assertions.t.boolean,
      Assertions.t.object,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertArrayType(
      [1],
      Assertions.t.number,
      null,
      Assertions.t.string,
      undefined,
      Assertions.t.object,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertArrayType(
      [() => void 0],
      Assertions.t.number,
      null,
      Assertions.t.string,
      undefined,
      Assertions.t.object,
    ).pass,
  ).toBeFalsy();
});
it('assertArrayType (objects)', () => {
  expect(
    Assertions.assertArrayType([{ a: '' }, { a: 0 }, { a: 'hello world' }], {
      a: Assertions.union<Assertions.t.string | Assertions.t.number>([
        Assertions.t.string,
        Assertions.t.number,
      ]),
    }).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertArrayType(
      [{ a: '' }, null, { a: 0 }, { a: 'hello world' }, null],
      {
        a: Assertions.union<Assertions.t.string | Assertions.t.number>([
          Assertions.t.string,
          Assertions.t.number,
        ]),
      },
      null,
    ).pass,
  ).toBeTruthy();
  expect(
    Assertions.assertArrayType(
      [{ a: '' }, null, { a: 0 }, { a: 'hello world' }, null, 10, null, null],
      {
        a: Assertions.union<Assertions.t.string | Assertions.t.number>([
          Assertions.t.string,
          Assertions.t.number,
        ]),
      },
      null,
    ).pass,
  ).toBeFalsy();
});
