import { Comparator } from './Comparator/Comparator.interfaces';

export function binarySearch<T, E>(arr: T[], elementToFind: E, comparator: Comparator<T, E>): number {
  let l = 0;
  let r = arr.length - 1;
  while (l < r) {
    const m = Math.floor((l + r) / 2);
    const comparison = comparator(arr[m], elementToFind);
    if (comparison === 0) return m;
    else if (comparison > 0) l = m + 1;
    else r = m - 1;
  }
  return -1;
}

export function lowerBound<T, E>(arr: T[], elementToFind: E, comparator: Comparator<T, E>): number {
  let l = 0;
  let r = arr.length - 1;
  while (l < r) {
    const m = Math.floor((l + r) / 2);
    const comparison = comparator(arr[m], elementToFind);
    if (comparison === 0) {
      return m;
    } else if (comparison > 0) l = m + 1;
    else r = m - 1;
  }
  return -1;
}
