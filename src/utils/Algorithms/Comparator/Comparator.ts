import { Comparator } from './Comparator.interfaces';

export const StringComparator: Comparator<string, string> = (item1, item2) => {
  return item1.localeCompare(item2);
};

export const NumberComparator: Comparator<number, number> = (elementToFind, item2) => {
  if (item2 > elementToFind) return -1;
  else if (item2 === elementToFind) return 0;
  else return 1;
};

export const StringAlphabeticalComparator: Comparator<string, string> = (item1, item2) => {
  if (item2.toLowerCase().trim().startsWith(item2.toLowerCase().trim())) return 0;
  return item1.localeCompare(item2);
};
