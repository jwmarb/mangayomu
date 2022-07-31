import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';

export interface ChapterTitleProps {
  chapter: ReadingChapterInfo;
  isCurrentlyBeingRead: boolean;
}
