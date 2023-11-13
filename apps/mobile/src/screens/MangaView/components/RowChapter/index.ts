export { default } from './RowChapter';
export interface RowChapterProps {
  isReading: boolean;
  name: string;
  subname?: string;
  date: string;
  chapterKey: string;
  mangaKey?: string;
}
