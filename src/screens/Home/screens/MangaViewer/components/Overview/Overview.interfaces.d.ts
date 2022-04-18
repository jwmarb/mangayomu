import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { Collapsible } from 'react-navigation-collapsible';

export interface OverviewProps {
  chapters: ReadingChapterInfo[];
  collapsible: Collapsible;
}
