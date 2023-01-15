export type Comparator<T, E = T> = (item: E, elementToFind: T) => number;

export const StringComparator: Comparator<string, string> = (a, b) => {
  return a.localeCompare(b);
};

export const NumberComparator: Comparator<number, number> = (a, b) => {
  if (a < b) return -1;
  else if (a === b) return 0;
  else return 1;
};
