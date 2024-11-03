import {
  useCurrentChapterContext,
  useCurrentPage,
} from '@/screens/Reader/context';
import ExtraReaderInfo from '@/screens/Reader/helpers/ExtraReaderInfo';

export default function useMetrics() {
  const currentPage = useCurrentPage();
  const currentChapter = useCurrentChapterContext();

  if (
    currentChapter == null ||
    !ExtraReaderInfo.containsChapter(currentChapter)
  ) {
    return null;
  }

  const totalPageCount = ExtraReaderInfo.getNumOfPages(currentChapter);

  return {
    currentPageNumber: currentPage?.page ?? 1,
    totalPageCount,
  };
}
