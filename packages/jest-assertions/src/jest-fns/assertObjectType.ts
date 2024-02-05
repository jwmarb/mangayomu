import {
  JSType,
  List,
  PASS,
  Union,
  isList,
  isUnion,
  list,
  stringify,
  typeToString,
} from '../utils/helpers';
import { JSTypes } from '../utils/jstypes';
import { AssertionResult } from '../utils/types';
import assertArrayType from './assertArrayType';
import assertType from './assertType';

/**
 * Asserts whether or not the value corresponds with the template
 * @param value The value to be asserted
 * @param type An object that is the template for `value`
 * @returns Returns an object with a boolean indicating whether the `value` matches its template and an error if it failed
 * @example
 * ```ts
 * type T = { a: string | null };
 * assertObjectType<T>({ a: 'foobar' }, { a: union(['string', 'null']) }); // true
 * assertObjectType<T>({ a: null }, { a: union(['string', 'null']) }); // true
 * assertObjectType<T>({ a: 10 }, { a: union(['string', 'null']) }); // false
 * assertObjectType<T>({ a: ["foobar", 10] }, { a: list(['string', 'number']) }); // true
 * ```
 */
export default function assertObjectType<T extends object>(
  value: T | undefined | null,
  type: JSType<T>,
): AssertionResult {
  if (value == null)
    return {
      pass: false,
      message: () =>
        `null is not an object\nExpected types: ${typeToString<T>(type)}`,
    };
  const keysB = Object.keys(type);
  // iterate through keysB since it is the full type template
  for (let i = 0; i < keysB.length; i++) {
    const templateKey = keysB[i] as unknown as keyof typeof type;
    const typeProperty = type[templateKey];
    const valueProperty = value[templateKey as unknown as keyof T];

    // Check if its a union
    if (isUnion(typeProperty)) {
      let flag = false;
      const newTypedProperty: readonly JSTypes[] = (
        typeProperty as Union<JSTypes>
      ).toArray();
      for (let j = 0; j < newTypedProperty.length; j++) {
        if (assertType(valueProperty, newTypedProperty[j]).pass) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        return {
          pass: false,
          message: () =>
            `Property ${stringify(
              templateKey,
            )} does not match with the union type: ${typeToString(
              typeProperty as any,
            )}\nGot: ${stringify(valueProperty as any)}`,
        };
      }
    }
    // Check if its a list
    else if (isList(typeProperty)) {
      if (!Array.isArray(valueProperty))
        return {
          pass: false,
          message: () =>
            `Property ${stringify(
              templateKey,
            )} does not match with the type: ${typeToString(
              typeProperty as any,
            )}`,
        };
      const newTypedProperty: readonly JSTypes[] = (
        typeProperty as List<JSTypes>
      ).toArray();
      if (!assertArrayType(valueProperty, ...newTypedProperty).pass) {
        return {
          pass: false,
          message: () =>
            `Property ${stringify(
              templateKey,
            )} has elements that violate the type: ${typeToString(
              typeProperty as any,
            )}\nFound: ${stringify(
              (valueProperty as any[]).filter(
                (x) => !assertType(x, ...newTypedProperty).pass,
              ),
            )}`,
        };
      }
    } else if (!assertType(valueProperty, typeProperty as JSTypes).pass)
      return {
        pass: false,
        message: () =>
          `Property ${stringify(
            templateKey,
          )} does not match with the type: ${typeToString(
            typeProperty as any,
          )}\nGot: ${stringify(valueProperty as any)}`,
      };
  }
  return PASS;
}
