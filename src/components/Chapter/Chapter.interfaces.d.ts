import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';

export interface ChapterProps {
  chapter: ReadingChapterInfo & { mangaName: string; sourceName: string };
}
