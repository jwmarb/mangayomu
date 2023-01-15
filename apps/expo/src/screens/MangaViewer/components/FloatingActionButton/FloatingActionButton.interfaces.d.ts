import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';

export interface FloatingActionButtonProps {
  isAtBeginning: boolean;
  currentChapter?: ReadingChapterInfo | null;
  onRead: () => void;
}
