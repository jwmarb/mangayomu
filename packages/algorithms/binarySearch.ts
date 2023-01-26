import { Comparator } from './Comparator';

/**
 * A basic binary search function.
 * @param arr The array
 * @param elementToFind Element to find
 * @param comparator A comparator function that will be used to compare elements
 * @returns Returns the index of an element
 */
function binarySearch<T, E>(
  arr: T[],
  elementToFind: E,
  comparator: Comparator<T, E>,
): number {
  let l = 0,
    r = arr.length;
  let m = -1,
    c = 0;
  while (l < r) {
    m = Math.floor((l + r) / 2);
    c = comparator(elementToFind, arr[m]);
    if (c === 0) return m;
    else if (c > 0) l = m + 1;
    else r = m;
  }
  return -1;
}

/**
 * Suggest which index for an element in a sorted array. The array MUST be sorted for this to work.
 * @param arr The array
 * @param elementToFind Element to insert to an index
 * @param comparator A comparator function that will be used to compare elements
 * @returns Returns the index that the element should be placed in to maintain element order based on the comparator function.
 */
function suggestIndex<T, E>(
  arr: T[],
  elementToFind: E,
  comparator: Comparator<T, E>,
): number {
  let l = 0,
    r = arr.length;
  let m = -1,
    c = 0;
  while (l < r) {
    m = Math.floor((l + r) / 2);
    c = comparator(elementToFind, arr[m]);
    if (c === 0) return m;
    else if (c > 0) l = m + 1;
    else r = m;
  }
  return l;
}

function lowerBound<T, E>(
  arr: T[],
  elementToFind: E,
  comparator: Comparator<T, E>,
): number {
  let l = 0;
  let r = arr.length - 1;
  let pos = -1;
  while (l < r) {
    const m = Math.floor((l + r) / 2);
    const comparison = comparator(elementToFind, arr[m]);
    if (comparison === 0) {
      pos = m;
      r = m - 1;
    } else if (comparison > 0) l = m + 1;
    else r = m - 1;
  }
  return pos;
}

function upperBound<T, E>(
  arr: T[],
  elementToFind: E,
  comparator: Comparator<T, E>,
): number {
  let l = 0;
  let r = arr.length - 1;
  let pos = -1;
  while (l < r) {
    const m = Math.floor((l + r) / 2);
    const comparison = comparator(elementToFind, arr[m]);
    if (comparison === 0) {
      pos = m;
      l = m + 1;
    } else if (comparison > 0) l = m + 1;
    else r = m - 1;
  }
  return pos;
}

function range<T, E>(
  arr: T[],
  elementToFind: E,
  comparator: Comparator<T, E>,
): [number, number] {
  const l = lowerBound(arr, elementToFind, comparator);
  if (l === -1) return [-1, -1];
  const r = upperBound(arr, elementToFind, comparator);
  return [l, r];
}

export const binary = {
  search: binarySearch,
  lowerBound,
  upperBound,
  range,
  suggest: suggestIndex,
};
