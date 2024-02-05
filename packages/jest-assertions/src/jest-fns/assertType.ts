import {
  Class,
  List,
  PASS,
  isList,
  stringify,
  typeToString,
  union,
} from '../utils/helpers';
import { JSTypes, JS_TYPES_SET, TYPE_MAPPING, t } from '../utils/jstypes';
import { AssertionResult } from '../utils/types';
import assertArrayType from './assertArrayType';
import assertObjectType from './assertObjectType';

/**
 * Asserts whether or not the value matches types. This is best for comparing primitives whose type is unknown at runtime. For matching complex structures, use `assertObjectType` or `assertArrayType` instead as those will give type hinting.
 * @param value The value to be asserted
 * @param types The types the value must match or equal
 * @returns Returns a boolean indicating whether or not `value` matches the union type
 * @example
 * ```ts
 * assertType("hello world", 'string'); // true
 * assertType("hello world", 'hello world'); // true
 * assertType("hello world", number, null); // false
 * assertType(10, 'number', null); // true
 * assertType(null, 'number', null); // true
 * ```
 */
export default function assertType(
  value: unknown,
  ...types: (
    | JSTypes
    | number
    | null
    | undefined
    | (string & object)
    | boolean
    | object
    | List<unknown>
    | Class<unknown>
  )[]
): AssertionResult {
  for (let i = 0; i < types.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof types[i] === 'string' && JS_TYPES_SET.has(types[i] as any)) {
      if (
        (types[i] == t.null && value === null) ||
        (types[i] != t.null &&
          typeof value === TYPE_MAPPING[types[i] as keyof typeof TYPE_MAPPING])
      )
        return PASS;
    } else if (
      types[i] != null &&
      typeof types[i] === 'object' &&
      typeof value === 'object' &&
      value != null &&
      assertObjectType(value, types[i] as any).pass
    )
      return PASS;
    else if (isList(types[i])) {
      const typed = types[i] as List<JSTypes>;
      if (assertArrayType(value, ...typed.toArray()).pass) return PASS;
    } else if (value === types[i]) return PASS;
    else if (
      typeof types[i] === 'function' &&
      value instanceof (types as any)[i]
    ) {
      return PASS;
    }
  }
  return {
    pass: false,
    message: () =>
      `${stringify(value)} does not satisfy the type: ${
        types.length > 1
          ? typeToString(union(types) as any)
          : typeToString(types[0] as any)
      }`,
  };
}
