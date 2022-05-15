import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { ISOLangCode } from '@utils/languageCodes';
import { Collapsible } from 'react-navigation-collapsible';

export interface OverviewProps {
  currentChapter?: ReadingChapterInfo | null;
  chapters: ReadingChapterInfo[];
  collapsible: Collapsible;
  language: ISOLangCode;
  onChangeLanguage: (l: ISOLangCode) => void;
}
