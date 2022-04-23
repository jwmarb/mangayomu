import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { Collapsible } from 'react-navigation-collapsible';

export interface OverviewProps {
  currentChapter?: ReadingChapterInfo | null;
  chapters: ReadingChapterInfo[];
  collapsible: Collapsible;
  loading: boolean;
}
