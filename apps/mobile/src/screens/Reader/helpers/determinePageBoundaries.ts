import { Query } from '@/screens/Reader/Reader';

// Define a type for page boundaries, mapping each page identifier to a tuple representing the start and end indices.
export type PageBoundaries = Record<string, [number, number]>;

/**
 * Determines the start and end page boundaries for each chapter in a list of pages.
 * The function calculates these boundaries based on the presence of chapter dividers
 * and whether the list contains only one chapter.
 *
 * @pre    The `pages` array is non-empty and contains valid page queries with chapter information.
 * @post   The `boundaries` object contains the calculated start and end page numbers for each chapter.
 * @param pages        An array of page queries, each containing chapter information and page count.
 * @param isOnlyChapter Optional boolean indicating if the list contains only one chapter.
 *
 * @returns An object where each key is a chapter link and the value is an array containing
 *          the start and end page numbers for that chapter.
 */
export default function determinePageBoundaries(
  pages: Query[],
  isOnlyChapter?: boolean,
): PageBoundaries {
  const boundaries: PageBoundaries = {}; // Object to store the start and end boundaries for each chapter
  let previousEndBoundary = 0; // Variable to keep track of the end boundary of the previous chapter
  for (let i = 0, n = pages.length; i < n; ++i) {
    const query = pages[i]; // Current page query
    switch (i) {
      case 0:
        // For the first chapter, set the end boundary based on whether it's the only chapter
        previousEndBoundary = query.pages.length - (isOnlyChapter ? 0 : 1);
        boundaries[query.chapter.link] = [
          isOnlyChapter ? 1 : 0, // Start at 1 if it's the only chapter, otherwise start at 0
          previousEndBoundary, // Set the end boundary for the first chapter
        ];
        break;
      default:
        // For subsequent chapters, calculate the start and end boundaries
        const start = previousEndBoundary + 2; // Start 2 pages after the previous chapter's end to skip the chapter divider
        previousEndBoundary = start + query.pages.length - 1; // Calculate the new end boundary
        boundaries[query.chapter.link] = [start, previousEndBoundary]; // Store the boundaries for the current chapter
        break;
    }
  }
  return boundaries; // Return the calculated boundaries for all chapters
}
