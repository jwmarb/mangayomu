import { assertType } from '../src/jest-fns';
import { t } from '../src/utils/jstypes';
import { AssertionResult } from '../src/utils/types';

class A {
  private readonly a: number;
  constructor() {
    this.a = 0;
  }
}

let result: AssertionResult;
it('assertType (primitive)', () => {
  result = assertType(true, true);

  expect(result.pass).toBeTruthy();
  expect(result.message()).toBe('');

  result = assertType(true, false);

  expect(result.pass).toBeFalsy();
  expect(result.message()).toBe('true does not satisfy the type: false');
});

it('assertType (union of primitives)', () => {
  result = assertType(0, t.number, t.string);

  expect(result.pass).toBeTruthy();
  expect(result.message()).toBe('');

  result = assertType(true, t.number, t.boolean);

  expect(result.pass).toBeTruthy();
  expect(result.message()).toBe('');

  result = assertType(null, t.null, t.number, t.boolean);

  expect(result.pass).toBeTruthy();
  expect(result.message()).toBe('');

  result = assertType('', t.null, t.number, t.boolean);

  expect(result.pass).toBeFalsy();
  expect(result.message()).toBe(
    '"" does not satisfy the type: (null | number | boolean)',
  );
});

it('assertType (union of classes)', () => {
  result = assertType(new A(), A, t.string, t.null);

  expect(result.pass).toBeTruthy();
  expect(result.message()).toBe('');

  result = assertType('works', A, String, Number);

  expect(result.pass).toBeFalsy();
  expect(result.message()).toBe(
    '"works" does not satisfy the type: (A | String | Number)',
  );

  result = assertType({}, A, String, Number, Object);

  expect(result.pass).toBeTruthy();
  expect(result.message()).toBe('');
});

it('assertType (Object)', () => {
  result = assertType(new A(), Object);

  expect(result.pass).toBeTruthy();
  expect(result.message()).toBe('');

  result = assertType(String, Object);

  expect(result.pass).toBeTruthy();
  expect(result.message()).toBe('');

  result = assertType(new Object(), {});

  expect(result.pass).toBeTruthy();
  expect(result.message()).toBe('');

  result = assertType({}, {});

  expect(result.pass).toBeTruthy();
  expect(result.message()).toBe('');
});
