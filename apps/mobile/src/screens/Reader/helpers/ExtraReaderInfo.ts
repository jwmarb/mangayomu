import determinePageBoundaries, {
  PageBoundaries,
} from '@/screens/Reader/helpers/determinePageBoundaries';
import MangaMetaHandler from '@/screens/Reader/helpers/MangaMetaHandler';
import type { Query } from '@/screens/Reader/Reader';
import { useCurrentChapter } from '@/screens/Reader/stores/chapter';
import { isChapter } from '@/utils/helpers';
import { MangaChapter, MangaSource } from '@mangayomu/mangascraper';

/**
 * Represents additional information related to the reader functionality.
 * This class is designed to provide utilities for the Reader to use as
 * additional information.
 */
class ExtraReaderInfo {
  private highestPageParam: number; // Stores the highest page parameter encountered during pagination.
  private lowestPageParam: number; // Stores the lowest page parameter encountered during pagination.
  private source: MangaSource | null; // Represents the source of the manga, which can be null if not yet set.
  private indices: PageBoundaries; // Holds the boundaries of the pages, likely including start and end indices.
  private dataLength: number; // Keeps track of the total number of data items available.
  private initialPageParam: number | null; // Stores the initial page parameter used to start fetching data, can be null if not set.
  public constructor() {
    this.indices = {};
    this.highestPageParam = Number.MIN_SAFE_INTEGER;
    this.lowestPageParam = Number.MAX_SAFE_INTEGER;
    this.source = null;
    this.dataLength = 0;
    this.initialPageParam = null;
  }

  /**
   * Resets the state of the reader by initializing all properties to their default values.
   *
   * @pre    The properties highestPageParam, lowestPageParam, indices, source, dataLength, and initialPageParam are set to some values.
   * @post   All properties are reset: highestPageParam is set to Number.MIN_SAFE_INTEGER, lowestPageParam is set to Number.MAX_SAFE_INTEGER,
   *         indices is an empty object, source is set to null, dataLength is set to 0, and initialPageParam is set to null.
   */
  public cleanup() {
    this.highestPageParam = Number.MIN_SAFE_INTEGER;
    this.lowestPageParam = Number.MAX_SAFE_INTEGER;
    this.indices = {};
    this.source = null;
    this.dataLength = 0;
    this.initialPageParam = null;
  }

  /**
   * Determines whether a chapter should be fetched based on the current chapter state and manga metadata availability.
   *
   * @pre    The useCurrentChapter and MangaMetaHandler modules are properly initialized.
   * @post   The method returns a boolean value indicating whether a chapter should be fetched.
   *
   * @returns A boolean value: true if the current chapter is not null and manga metadata is available, false otherwise.
   */
  public shouldFetchChapter() {
    return (
      useCurrentChapter.getState().currentChapter != null &&
      MangaMetaHandler.getMangaMeta() != null
    );
  }

  public determinePageBoundaries(pages: Query[], isOnlyChapter?: boolean) {
    this.indices = determinePageBoundaries(pages, isOnlyChapter);
  }

  /**
   * Sets the initial page parameter based on the provided chapter.
   * This method assumes that setMangaMeta has been called at least once.
   * It finds the index of the chapter in the MangaMeta chapters list
   * that matches the provided chapter by comparing their links.
   * If a match is found, the index is stored in initialPageParam.
   * If no match is found, initialPageParam is set to -1.
   *
   * @pre setMangaMeta has been called once
   * @param chapter - The chapter object for which the initial page parameter needs to be set.
   */
  public setInitialPageParam(chapter: unknown) {
    if (this.initialPageParam == null) {
      this.initialPageParam =
        MangaMetaHandler.getMangaMeta()!.chapters.findIndex(
          (item) =>
            this.source!.toChapter(item, MangaMetaHandler.getTMangaMeta())
              .link ===
            this.source!.toChapter(chapter, MangaMetaHandler.getTMangaMeta())
              .link,
        ) ?? -1;
    }
  }

  public getInitialPageParam() {
    return this.initialPageParam!;
  }

  public setSource(sourceStr?: string) {
    if (sourceStr != null) {
      this.source = MangaSource.getSource(sourceStr);
    }
  }

  public setDataLength(dataLength: number) {
    this.dataLength = dataLength;
  }

  /**
   * Determines whether the given index is at the end of the data.
   *
   * @pre    The index is either a valid number or null.
   * @post   The method returns a boolean value indicating whether the index is at the last position of the data.
   * @param  index    The index to check. If null, it is not considered to be at the end.
   *
   * @returns  A boolean value: true if the index is at the end of the data, false otherwise.
   */
  public isAtEnd(index: number | null) {
    return index === this.dataLength - 1;
  }

  /**
   * @pre setSource has been called
   * @returns The manga source
   */
  public getSource() {
    return this.source!;
  }

  /**
   * Sets the page parameter, updating the highest and lowest page parameters accordingly.
   * The highestPageParam is updated to be the maximum of the current highestPageParam and the provided pageParam.
   * The lowestPageParam is updated to be the minimum of the current lowestPageParam and the provided pageParam.
   *
   * @param pageParam - The page parameter to set. This is a number representing a page index or identifier.
   */
  public setPageParam(pageParam: number) {
    this.highestPageParam = Math.max(pageParam, this.highestPageParam);
    this.lowestPageParam = Math.min(pageParam, this.lowestPageParam);
  }

  /**
   * Retrieves the page boundaries for a given chapter.
   * The chapter can be provided as either a MangaChapter object or a string representing the chapter link.
   *
   * @pre    The chapter must be a valid MangaChapter object or a string that exists as a key in the indices object.
   * @post   The page boundaries for the specified chapter are returned.
   * @param chapter    The chapter for which to retrieve the page boundaries. It can be either a MangaChapter object or a string.
   *
   * @returns A tuple containing the start and end page numbers for the specified chapter.
   */
  public getPageBoundaries(chapter: MangaChapter | string): [number, number] {
    if (isChapter(chapter)) {
      return this.indices[chapter.link];
    }

    return this.indices[chapter];
  }

  /**
   * Calculates the number of pages in a given chapter.
   *
   * @pre    The chapter is a valid MangaChapter object or a string representing a chapter identifier.
   * @post   The number of pages in the specified chapter is calculated and returned.
   * @param chapter    The chapter for which to calculate the number of pages. It can be a MangaChapter object or a string.
   *
   * @returns The total number of pages in the specified chapter.
   */
  public getNumOfPages(chapter: MangaChapter | string) {
    const [start, end] = this.getPageBoundaries(chapter);
    return end - start + 1;
  }

  /**
   * Checks if the provided chapter is present in the indices.
   *
   * @pre    The indices object is initialized and contains chapter links as keys.
   * @post   The method returns a boolean indicating the presence of the chapter.
   * @param chapter    The chapter to check, can be either a MangaChapter object or a string representing the chapter link.
   *
   * @returns  A boolean value: true if the chapter is found in the indices, false otherwise.
   */
  public containsChapter(chapter: MangaChapter | string) {
    if (isChapter(chapter)) {
      return chapter.link in this.indices;
    }

    return chapter in this.indices;
  }

  /**
   * Determines whether or not the current pointer to fetch the next chapter is `chapter` from the reader
   * @pre this.meta != null && this.source != null && this.tmangameta != null
   * @param chapter A MangaChapter object or string representing the link to that chapter
   * @returns Returns a boolean indicating whether or not the current pointer to fetch the next chapter is `chapter`
   */
  public isNextFetched(chapter: MangaChapter | string): boolean {
    const latestFetchedChapter =
      MangaMetaHandler.getMangaMeta()!.chapters[this.highestPageParam];
    const parsedLatest = this.source!.toChapter(
      latestFetchedChapter,
      MangaMetaHandler.getTMangaMeta(),
    );
    if (isChapter(chapter)) {
      return parsedLatest.link === chapter.link;
    }
    return parsedLatest.link === chapter;
  }
}

export default new ExtraReaderInfo();
