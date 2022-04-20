import { Comparator } from './Comparator/Comparator.interfaces';

function binarySearch<T, E>(arr: T[], elementToFind: E, comparator: Comparator<T, E>): number {
  let l = 0;
  let r = arr.length - 1;
  while (l <= r) {
    const m = Math.floor((l + r) / 2);
    const comparison = comparator(elementToFind, arr[m]);
    if (comparison === 0) return m;
    else if (comparison > 0) l = m + 1;
    else r = m - 1;
  }
  return -1;
}

function lowerBound<T, E>(arr: T[], elementToFind: E, comparator: Comparator<T, E>): number {
  let l = 0;
  let r = arr.length - 1;
  let pos = -1;
  while (l <= r) {
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

function upperBound<T, E>(arr: T[], elementToFind: E, comparator: Comparator<T, E>): number {
  let l = 0;
  let r = arr.length - 1;
  let pos = -1;
  while (l <= r) {
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

function range<T, E>(arr: T[], elementToFind: E, comparator: Comparator<T, E>): [number, number] {
  const min = lowerBound(arr, elementToFind, comparator);
  if (min === -1) return [-1, -1];
  const max = upperBound(arr, elementToFind, comparator);
  return [min, max];
}

const binary = {
  search: binarySearch,
  lowerBound,
  upperBound,
  range,
};

export default binary;
