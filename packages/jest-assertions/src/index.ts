/* eslint-disable @typescript-eslint/no-explicit-any */
import assertObjectType from './jest-fns/assertObjectType';
import assertArrayType from './jest-fns/assertArrayType';
import assertType from './jest-fns/assertType';
export { t } from './utils/jstypes';
export { union, list, List, Union } from './utils/helpers';
import { isList, isUnion, type JSType } from './utils/helpers';
export type { JSType } from './utils/helpers';
export default {
  toMatchType<T>(value: T, type: JSType<T>) {
    if (typeof value === 'object' && !Array.isArray(value))
      return assertObjectType(value, type as any);

    if (Array.isArray(value) || isList(type))
      return assertArrayType(value, ...(type as any).toArray());

    if (isUnion(type)) return assertType(value, ...(type as any).toArray());
    return assertType(value, ...(type as any));
  },
};
