import { Comparator } from './Comparator';

/**
 * A basic binary search function.
 * @param arr The array
 * @param elementToFind Element to find
 * @param comparator A comparator function that will be used to compare elements
 * @returns Returns the index of an element
 */
function binarySearch<T, E>(
  arr: ArrayLike<T>,
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
  arr: ArrayLike<T>,
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
  arr: ArrayLike<T>,
  elementToFind: E,
  comparator: Comparator<T, E>,
): number {
  let l = 0,
    r = arr.length - 1,
    m: number;
  while (l < r) {
    m = Math.floor((l + r) / 2);
    const comparison = comparator(elementToFind, arr[m]);
    if (comparison <= 0) {
      r = m;
    } else {
      l = m + 1;
    }
  }
  return comparator(elementToFind, arr[l]) === 0 ? l : -1;
}

function upperBound<T, E>(
  arr: ArrayLike<T>,
  elementToFind: E,
  comparator: Comparator<T, E>,
): number {
  let l = 0,
    r = arr.length,
    m: number;
  while (l < r) {
    m = Math.floor((l + r) / 2);
    const comparison = comparator(elementToFind, arr[m]);
    if (comparison >= 0) {
      l = m + 1;
    } else {
      r = m;
    }
  }
  return comparator(elementToFind, arr[l - 1]) === 0 ? l - 1 : -1;
}

/**
 * Gets the index range from the beginning inclusive to the end exclusive [start, end)
 * @param arr The array
 * @param elementToFind The element to find within the array
 * @param comparator A function that compares `elementToFind` to some element E in `arr`
 * @returns Returns the range [start, end)
 */
function range<T, E>(
  arr: ArrayLike<T>,
  elementToFind: E,
  comparator: Comparator<T, E>,
): [number, number] {
  const l = lowerBound(arr, elementToFind, comparator);
  if (l === -1) return [-1, -1];
  const r = upperBound(arr, elementToFind, comparator);
  return [l, r + 1];
}

export const binary = {
  search: binarySearch,
  lowerBound,
  upperBound,
  range,
  suggest: suggestIndex,
};
