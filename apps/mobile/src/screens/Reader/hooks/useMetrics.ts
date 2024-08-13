import {
  useCurrentChapterContext,
  useCurrentPage,
  usePageBoundaries,
} from '@/screens/Reader/context';
import { PageBoundaries } from '@/screens/Reader/helpers/determinePageBoundaries';

export function getPageCount(
  chapterLink: string,
  boundaries: React.MutableRefObject<PageBoundaries>,
) {
  const [startPageNumber, endPageNumber] = boundaries.current[chapterLink];

  return endPageNumber - startPageNumber + 1;
}

export default function useMetrics() {
  const boundaries = usePageBoundaries();
  const currentPage = useCurrentPage();
  const currentChapter = useCurrentChapterContext();

  if (
    currentChapter == null ||
    currentChapter.link in boundaries.current === false
  ) {
    return null;
  }

  const totalPageCount = getPageCount(currentChapter.link, boundaries);

  return {
    currentPageNumber: currentPage?.page ?? 1,
    totalPageCount,
  };
}
