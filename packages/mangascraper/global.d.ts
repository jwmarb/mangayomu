/* eslint-disable @typescript-eslint/no-empty-interface */
import type { CustomMatchers } from '@mangayomu/jest-assertions';
interface MangascraperAssertions<R = any> extends CustomMatchers<R> {
  toMatchChapterOrder: () => void;
}
declare global {
  namespace jest {
    interface Matchers<R> extends MangascraperAssertions<R> {}
    interface Expect extends MangascraperAssertions {}
    interface InverseAsymmetricMatchers extends MangascraperAssertions {}
  }
}
