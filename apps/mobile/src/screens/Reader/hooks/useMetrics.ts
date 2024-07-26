import {
  useCurrentChapterContext,
  useCurrentPage,
  usePageBoundaries,
} from '@/screens/Reader/context';

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

  const [startPageNumber, endPageNumber] =
    boundaries.current[currentChapter.link];

  const totalPageCount = endPageNumber - startPageNumber + 1;

  return {
    currentPageNumber: currentPage?.page ?? 1,
    totalPageCount,
  };
}
