import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { Manga, MangaChapter } from '@services/scraper/scraper.interfaces';
import { ISOLangCode } from '@utils/languageCodes';
import { Collapsible } from 'react-navigation-collapsible';
import { DataProvider } from 'recyclerlistview';

export interface OverviewProps {
  currentChapter?: ReadingChapterInfo | null;
  chapters: MangaChapter[];
  dataProvider: DataProvider;
  collapsible: Collapsible;
  loading: boolean;
  manga: Manga;
  onRead: () => void;
  rowRenderer: (
    type: string | number,
    data: any,
    index: number,
    extendedState?: object | undefined
  ) => JSX.Element | JSX.Element[] | null;
}
