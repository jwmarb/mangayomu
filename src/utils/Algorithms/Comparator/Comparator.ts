import { Comparator } from './Comparator.interfaces';

export const StringComparator: Comparator<string, string> = (a, b) => {
  return b.localeCompare(a);
};

export const NumberComparator: Comparator<number, number> = (a, b) => {
  if (b > a) return -1;
  else if (b === a) return 0;
  else return 1;
};

export const StringAlphabeticalComparator: Comparator<string, string> = (a, b) => {
  const len = a.length;
  return a.substring(0, len).trim().localeCompare(b.substring(0, len).trim());
};
