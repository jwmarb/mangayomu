import useMangaMeta from '@/screens/MangaView/hooks/useMangaMeta';
import determinePageBoundaries, {
  PageBoundaries,
} from '@/screens/Reader/helpers/determinePageBoundaries';
import type { Query } from '@/screens/Reader/Reader';
import { isChapter } from '@/utils/helpers';
import { MangaChapter, MangaMeta, MangaSource } from '@mangayomu/mangascraper';

class ExtraReaderInfo {
  private tmangameta: unknown;
  private meta: MangaMeta | null;
  private highestPageParam: number;
  private lowestPageParam: number;
  private source: MangaSource | null;
  private indices: PageBoundaries;
  private dataLength: number;
  private initialPageParam: number | null;
  private currentChapter: MangaChapter | null;
  public constructor() {
    this.indices = {};
    this.highestPageParam = Number.MIN_SAFE_INTEGER;
    this.lowestPageParam = Number.MAX_SAFE_INTEGER;
    this.tmangameta = null;
    this.meta = null;
    this.source = null;
    this.dataLength = 0;
    this.initialPageParam = null;
    this.currentChapter = null;
  }

  public cleanup() {
    this.highestPageParam = Number.MIN_SAFE_INTEGER;
    this.lowestPageParam = Number.MAX_SAFE_INTEGER;
    this.indices = {};
    this.tmangameta = null;
    this.meta = null;
    this.source = null;
    this.dataLength = 0;
    this.initialPageParam = null;
    this.currentChapter = null;
  }

  public setCurrentChapter(chapter: MangaChapter) {
    this.currentChapter = chapter;
  }

  public getCurrentChapter() {
    return this.currentChapter!;
  }

  public shouldFetchChapter() {
    return this.currentChapter != null && this.tmangameta != null;
  }

  public determinePageBoundaries(pages: Query[], isOnlyChapter?: boolean) {
    this.indices = determinePageBoundaries(pages, isOnlyChapter);
  }

  /**
   * @pre setSource has been called before this method
   * @param meta
   */
  public setMangaMeta(meta: ReturnType<typeof useMangaMeta>['data']) {
    if (meta != null) {
      this.tmangameta = meta[0];
      this.meta = meta[1];
    }
  }

  /**
   * @pre setMangaMeta has been called once
   * @param chapter
   * @returns
   */
  public setInitialPageParam(chapter: unknown) {
    if (this.initialPageParam == null) {
      this.initialPageParam =
        this.meta!.chapters.findIndex(
          (item) =>
            this.source!.toChapter(item, this.tmangameta).link ===
            this.source!.toChapter(chapter, this.tmangameta).link,
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

  public setPageParam(pageParam: number) {
    this.highestPageParam = Math.max(pageParam, this.highestPageParam);
    this.lowestPageParam = Math.min(pageParam, this.lowestPageParam);
  }

  public getPageBoundaries(chapter: MangaChapter | string): [number, number] {
    if (isChapter(chapter)) {
      return this.indices[chapter.link];
    }

    return this.indices[chapter];
  }

  public getNumOfPages(chapter: MangaChapter | string) {
    const [start, end] = this.getPageBoundaries(chapter);
    return end - start + 1;
  }

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
    const latestFetchedChapter = this.meta!.chapters[this.highestPageParam];
    const parsedLatest = this.source!.toChapter(
      latestFetchedChapter,
      this.tmangameta,
    );
    if (isChapter(chapter)) {
      return parsedLatest.link === chapter.link;
    }
    return parsedLatest.link === chapter;
  }

  public getTMangaMeta() {
    return this.tmangameta;
  }

  public getMangaMeta() {
    return this.meta;
  }
}

export default new ExtraReaderInfo();
