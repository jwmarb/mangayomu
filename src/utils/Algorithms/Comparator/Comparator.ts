import { Comparator } from './Comparator.interfaces';

export const StringComparator: Comparator<string, string> = (item1, item2) => {
  return item2.localeCompare(item1);
};

export const NumberComparator: Comparator<number, number> = (item1, elementToFind) => {
  if (item1 > elementToFind) return -1;
  else if (item1 === elementToFind) return 0;
  else return 1;
};
