import { MangaHistoryObject } from '@redux/reducers/mangaHistoryReducer/mangaHistoryReducer.interfaces';
import { Comparator } from '@utils/Algorithms/Comparator/Comparator.interfaces';

export const mangaHistoryComparator: Comparator<MangaHistoryObject> = (item, toFind) =>
  item.mangaKey.localeCompare(toFind.mangaKey);
