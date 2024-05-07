export { default } from './RowChapter';
export interface RowChapterProps {
  isReading: boolean;
  name: string;
  subname?: string;
  date: number;
  chapterKey: string;
  mangaKey?: string;
}
