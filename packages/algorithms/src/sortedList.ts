import { Comparator } from './Comparator';
import { binary } from './binarySearch';

/**
 * Adds an element to a sorted array while maintaining order. This uses binary search.
 * @param array A sorted array of elements
 * @param el The element(s) to add in the `array`
 * @param comparator A comparison function that compares `el` to `array[i]`
 */
export function add<T>(array: T[], el: T | T[], comparator: Comparator<T>) {
  if (Array.isArray(el)) {
    const n = el.length;
    let idx = -1;
    for (let i = 0; i < n; i++) {
      idx = binary.suggest(array, el[i], comparator);
      array.splice(idx, 0, el[i]);
    }
  } else {
    const idx = binary.suggest(array, el, comparator);
    array.splice(idx, 0, el);
  }
}

/**
 * Finds an removes an element from a sorted array. This uses binary search.
 * @param array A sorted array of elements
 * @param el The element(s) to remove from the `array`
 * @param comparator A comparison function that compares `el` to `array[i]`
 * @returns Returns a boolean indicating whether the operation is successful
 */
export function remove<T>(
  array: T[],
  el: T | T[],
  comparator: Comparator<T>,
): boolean {
  if (Array.isArray(el)) {
    const n = el.length;
    let idx = -1;
    for (let i = 0; i < n; i++) {
      idx = binary.search(array, el[i], comparator);
      if (idx !== -1) {
        array.splice(idx, 1);
      } else {
        return false;
      }
    }
  } else {
    const idx = binary.search(array, el, comparator);
    if (idx !== -1) {
      array.splice(idx, 1);
    } else {
      return false;
    }
  }
  return true;
}
