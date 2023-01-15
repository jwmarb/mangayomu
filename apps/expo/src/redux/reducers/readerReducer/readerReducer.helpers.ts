import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { MangaPage, Page } from '@redux/reducers/readerReducer/readerReducer.interfaces';
import { MangaChapter } from '@services/scraper/scraper.interfaces';
import { Image } from 'react-native';

export function getImageDimensions(chapter: ReadingChapterInfo, nextChapter: MangaChapter | null) {
  return (uri: string) =>
    new Promise<Page>((res, rej) => {
      Image.getSize(
        uri,
        (width, height) => {
          res({
            width,
            height,
            link: uri,
            type: 'PAGE',
            chapter,
            nextChapterTransitioningKey: nextChapter
              ? generateExtendedStateKey(nextChapter.link, chapter.link)
              : undefined,
          });
        },
        rej
      );
    });
}

export function generateExtendedStateKey(next: string, prev: string) {
  return `prev-${prev}+next-${next}`;
}
