import { useCurrentPage } from '@/screens/Reader/context';
import ExtraReaderInfo from '@/screens/Reader/helpers/ExtraReaderInfo';
import { useCurrentChapter } from '@/screens/Reader/stores/chapter';

export default function useMetrics() {
  const currentPage = useCurrentPage();
  const currentChapter = useCurrentChapter(
    (selector) => selector.currentChapter,
  );

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
