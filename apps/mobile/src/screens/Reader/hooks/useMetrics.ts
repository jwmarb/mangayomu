import { useCurrentPage } from '@/screens/Reader/context';
import ExtraReaderInfo from '@/screens/Reader/helpers/ExtraReaderInfo';
import { useCurrentChapter } from '@/screens/Reader/stores/chapter';

/**
 * Retrieves the current page number and total page count for the current chapter.
 * If the current chapter is null or not contained in the ExtraReaderInfo, returns null.
 *
 * @pre    The ExtraReaderInfo is properly initialized and contains chapter information.
 * @post   The current page number and total page count for the current chapter are returned.
 *         If the current chapter is invalid, null is returned.
 *
 * @returns An object containing the current page number and total page count for the current chapter,
 *          or null if the current chapter is invalid.
 */
export default function useMetrics() {
  const currentPage = useCurrentPage();
  const currentChapter = useCurrentChapter(
    (selector) => selector.currentChapter,
  );

  // If the current chapter is null or not contained in the ExtraReaderInfo, return null.
  if (
    currentChapter == null ||
    !ExtraReaderInfo.containsChapter(currentChapter)
  ) {
    return null;
  }

  // Retrieve the total number of pages for the current chapter.
  const totalPageCount = ExtraReaderInfo.getNumOfPages(currentChapter);

  // Return an object containing the current page number and total page count.
  return {
    currentPageNumber: currentPage?.page ?? 1,
    totalPageCount,
  };
}
