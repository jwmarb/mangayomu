import * as a from '../src';
const { t } = a;
import { AssertionResult } from '../src/utils/types';

class A {
  private readonly a: number;
  constructor() {
    this.a = 0;
  }
}

let result: AssertionResult;
it('assertType (primitive)', () => {
  result = a.assertType(true, true);

  expect(result.pass).toBeTruthy();
  expect(result.message()).toBe('');

  result = a.assertType(true, false);

  expect(result.pass).toBeFalsy();
  expect(result.message()).toBe('true does not satisfy the type: false');
});

it('assertType (union of primitives)', () => {
  result = a.assertType(0, t.number, t.string);

  expect(result.pass).toBeTruthy();
  expect(result.message()).toBe('');

  result = a.assertType(true, t.number, t.boolean);

  expect(result.pass).toBeTruthy();
  expect(result.message()).toBe('');

  result = a.assertType(null, t.null, t.number, t.boolean);

  expect(result.pass).toBeTruthy();
  expect(result.message()).toBe('');

  result = a.assertType('', t.null, t.number, t.boolean);

  expect(result.pass).toBeFalsy();
  expect(result.message()).toBe(
    '"" does not satisfy the type: (null | number | boolean)',
  );
});

it('assertType (union of classes)', () => {
  result = a.assertType(new A(), A, t.string, t.null);

  expect(result.pass).toBeTruthy();
  expect(result.message()).toBe('');

  result = a.assertType('works', A, String, Number);

  expect(result.pass).toBeFalsy();
  expect(result.message()).toBe(
    '"works" does not satisfy the type: (A | String | Number)',
  );

  result = a.assertType({}, A, String, Number, Object);

  expect(result.pass).toBeTruthy();
  expect(result.message()).toBe('');
});

it('assertType (Object)', () => {
  result = a.assertType(new A(), Object);

  expect(result.pass).toBeTruthy();
  expect(result.message()).toBe('');

  result = a.assertType(String, Object);

  expect(result.pass).toBeTruthy();
  expect(result.message()).toBe('');

  result = a.assertType(new Object(), {});

  expect(result.pass).toBeTruthy();
  expect(result.message()).toBe('');

  result = a.assertType({}, {});

  expect(result.pass).toBeTruthy();
  expect(result.message()).toBe('');
});
