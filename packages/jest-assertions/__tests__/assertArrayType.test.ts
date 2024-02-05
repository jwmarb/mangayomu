import { assertArrayType } from '../src/jest-fns';
import { t } from '../src/utils/jstypes';
import { union } from '../src/utils/helpers';

it('assertArrayType (primitives only)', () => {
  expect(assertArrayType([1, 2, 3], t.number).pass).toBeTruthy();
  expect(assertArrayType(undefined, t.number).pass).toBeFalsy();
  expect(assertArrayType(undefined, t.number).message()).toBe(
    'Did not receive an array.\nExpected: number[]\nGot: undefined',
  );
  expect(assertArrayType(['hello', 'world'], t.string).pass).toBeTruthy();
  expect(assertArrayType([true, false], t.boolean).pass).toBeTruthy();
  expect(assertArrayType([{}, {}, {}], t.object).pass).toBeTruthy();
  expect(
    assertArrayType([undefined, undefined], t.undefined).pass,
  ).toBeTruthy();
  expect(
    assertArrayType(
      [],
      t.string,
      t.bigint,
      t.boolean,
      t.function,
      t.number,
      t.object,
      t.symbol,
      t.undefined,
    ).pass,
  ).toBeTruthy();
  expect(assertArrayType(['hello world'], t.number).pass).toBeFalsy();
  expect(assertArrayType(['hello world'], t.number).message()).toBe(
    'List does not match type\nExpected: number[]\nGot: ["hello world"]',
  );
});
it('assertArrayType (union)', () => {
  expect(
    assertArrayType(
      [1, '', null, undefined, false, {}],
      t.number,
      null,
      t.string,
      undefined,
      t.boolean,
      t.object,
    ).pass,
  ).toBeTruthy();
  expect(
    assertArrayType([1], t.number, null, t.string, undefined, t.object).pass,
  ).toBeTruthy();
  expect(
    assertArrayType(
      [() => void 0],
      t.number,
      null,
      t.string,
      undefined,
      t.object,
    ).pass,
  ).toBeFalsy();
});
it('assertArrayType (objects)', () => {
  expect(
    assertArrayType([{ a: '' }, { a: 0 }, { a: 'hello world' }], {
      a: union<t.string | t.number>([t.string, t.number]),
    }).pass,
  ).toBeTruthy();
  expect(
    assertArrayType(
      [{ a: '' }, null, { a: 0 }, { a: 'hello world' }, null],
      {
        a: union<t.string | t.number>([t.string, t.number]),
      },
      null,
    ).pass,
  ).toBeTruthy();
  expect(
    assertArrayType(
      [{ a: '' }, null, { a: 0 }, { a: 'hello world' }, null, 10, null, null],
      {
        a: union<t.string | t.number>([t.string, t.number]),
      },
      null,
    ).pass,
  ).toBeFalsy();
});
