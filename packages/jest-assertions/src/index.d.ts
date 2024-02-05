/* eslint-disable @typescript-eslint/no-empty-interface */
import { JSType } from './utils/helpers';

export interface CustomMatchers<R = any>  {
  toMatchType<T>(type: JSType<T>): R;
}

declare global {
  namespace jest {
    interface Matchers<R> extends CustomMatchers<R> {}
    interface Expect extends CustomMatchers {}
    interface InverseAsymmetricMatchers extends Expect {}
  }
}

// export { default as assertObjectType } from './jest-fns/assertObjectType';
// export { default as assertArrayType } from './jest-fns/assertArrayType';
// export { default as assertType } from './jest-fns/assertType';
export { t } from './utils/jstypes';
export { union, list, List, Union } from './utils/helpers';
export type { JSType } from './utils/helpers';
export default {
  toMatchType<T>(value: T, type: JSType<T>): R;
};