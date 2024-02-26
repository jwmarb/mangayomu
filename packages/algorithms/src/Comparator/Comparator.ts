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

export const AscendingNumberComparator: Comparator<number, number> = (a, b) =>
  a - b;

export const DescendingNumberComparator: Comparator<number, number> = (a, b) =>
  b - a;
