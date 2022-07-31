import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { Manga } from '@services/scraper/scraper.interfaces';
import { ISOLangCode } from '@utils/languageCodes';
import { Collapsible } from 'react-navigation-collapsible';

export interface OverviewProps {
  currentChapter?: ReadingChapterInfo | null;
  chapters: ReadingChapterInfo[];
  collapsible: Collapsible;
  language: ISOLangCode;
  onChangeLanguage: (l: ISOLangCode) => void;
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
