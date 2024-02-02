import MangaSee from './MangaSee';
import { Directory } from './MangaSee.interfaces';

function containsType<T>(items: T[], matchingFn: (element: T) => boolean) {
  for (let i = 0; i < items.length; i++) {
    expect(matchingFn(items[i])).toBe(true);
  }
}

function isArrayType(
  el: unknown,
  type: 'string' | 'number' | 'object' | 'boolean',
) {
  if (!Array.isArray(el)) return false;

  for (let i = 0; i < el.length; i++) {
    if (typeof el !== type) return false;
  }

  return true;
}

describe('directory', () => {
  it('gets manga directory', () => {
    const matchesType = (element: Directory) =>
      isArrayType(element.a, 'string') &&
      isArrayType(element.al, 'string') &&
      isArrayType(element.g, 'string') &&
      typeof element.h === 'boolean' &&
      typeof element.i === 'string' &&
      typeof element.ls === 'string' &&
      typeof element.lt === 'string' &&
      typeof element.o === 'string' &&
      typeof element.ps === 'string' &&
      typeof element.s === 'string' &&
      typeof element.ss === 'string' &&
      typeof element.t === 'string' &&
      typeof element.v === 'string' &&
      typeof element.vm === 'string' &&
      typeof element.y === 'string';

    MangaSee.getDirectory().then((directory) => {
      expect(directory).toBeTruthy();
      expect(directory.length).toBeGreaterThan(0);
      containsType(directory, matchesType);
    });
  });
});
