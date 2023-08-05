export { default } from './RowChapter';
export interface RowChapterProps {
  isReading: boolean;
  name: string;
  date: string;
  chapterKey: string;
  mangaKey?: string;
}
