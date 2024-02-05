import { PASS, list, stringify, typeToString } from '../utils/helpers';
import { AssertionResult } from '../utils/types';
import assertType from './assertType';

/**
 * Asserts whether or not the elements of an array match types
 * @param value The array to be asserted
 * @param types The types that the elements in the array must match or equal
 * @returns Returns a boolean indicating whether or not the elements of `value` match the union
 * @example
 * ```ts
 * ["Hello", "World", null] // has a type (string | null)[]  OR  ("Hello" | "World" | null)[]
 *
 * assertArrayType(["Hello", "World", null], 'string', null); // true
 * assertArrayType(["Hello", "World", null], 'Hello', 'World', null); // true
 * assertArrayType([5, 1, undefined], 'number'); // false
 * assertArrayType(null, null); // false
 * ```
 */
export default function assertArrayType(
  ...params: Parameters<typeof assertType>
): AssertionResult {
  const [values, ...types] = params;
  if (!Array.isArray(values))
    return {
      pass: false,
      message: () =>
        `Did not receive an array.\nExpected: ${typeToString(
          list(types) as any,
        )}\nGot: ${stringify(values)}`,
    };

  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    if (!assertType(value, ...types).pass)
      return {
        pass: false,
        message: () =>
          `List does not match type\nExpected: ${typeToString(
            list(types) as any,
          )}\nGot: ${stringify(values)}`,
      };
  }
  return PASS;
}
