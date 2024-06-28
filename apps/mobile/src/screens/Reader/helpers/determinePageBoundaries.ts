import { Query } from '@/screens/Reader/Reader';

export type PageBoundaries = Record<string, [number, number]>;

export default function determinePageBoundaries(
  pages: Query[],
): PageBoundaries {
  const boundaries: PageBoundaries = {};
  let previousEndBoundary = 0;
  for (let i = 0, n = pages.length; i < n; ++i) {
    const query = pages[i];
    switch (i) {
      case 0:
        previousEndBoundary = query.pages.length - 1;
        boundaries[query.chapter.link] = [0, previousEndBoundary];
        break;
      default:
        const start = previousEndBoundary + 2; // increment by 2 to skip chapter divider and start at the beginning of the chapter
        previousEndBoundary = start + query.pages.length - 1;
        boundaries[query.chapter.link] = [start, previousEndBoundary];
        break;
    }
  }
  return boundaries;
}
