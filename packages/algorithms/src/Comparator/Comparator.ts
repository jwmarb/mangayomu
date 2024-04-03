/**
 * A function that compares two elements. Return order should be based on `elementToFind`.
 *
 * @example
 * ```ts
 * const comparator: Comparator<number> = (elementToFind, item) => {
 *   if (elementToFind > item) return 1;
 *   else if (elementToFind === item) return 0;
 *   else return -1; // elementToFind < item
 * }
 * ```
 */
export type Comparator<T, E = T> = (elementToFind: E, item: T) => number;

export const AscendingStringComparator: Comparator<string, string> = (a, b) => {
  return a.localeCompare(b);
};

export const DescendingStringComparator: Comparator<string, string> = (
  a,
  b,
) => {
  return b.localeCompare(a);
};

export const AscendingLengthComparator: Comparator<
  string | ArrayLike<unknown>
> = (a, b) => a.length - b.length;

export const DescendingLengthComparator: Comparator<
  string | ArrayLike<unknown>
> = (a, b) => b.length - a.length;

export const AscendingNumberComparator: Comparator<number, number> = (a, b) =>
  a - b;

export const DescendingNumberComparator: Comparator<number, number> = (a, b) =>
  b - a;
