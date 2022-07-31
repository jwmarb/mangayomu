import { MangaPage } from '@redux/reducers/readerReducer/readerReducer.interfaces';

export const keyExtractor = (item: MangaPage, index: number) => {
  switch (item.type) {
    case 'NEXT_CHAPTER':
    case 'PREVIOUS_CHAPTER':
      return item.key;
    case 'CHAPTER_TRANSITION':
      return index.toString();
    case 'NO_MORE_CHAPTERS':
      return 'NO MORE CHAPTERS';
    case 'PAGE':
      return item.link;
  }
};
