import { useAppDispatch } from '@redux/main';
import {
  FetchPagesByChapterPayload,
  fetchPagesByChapter,
  fetchedChapters,
  fetchingChapters,
  resetReaderState,
} from '@redux/slices/reader/reader';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import React from 'react';
import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaHost } from '@mangayomu/mangascraper';
import { useLocalRealm } from '@database/main';

/**
 * A hook to create a fetcher to fetch a chapter
 * @param args Args necessary to execute the fetcher
 * @returns Returns a simple fetch function that accepts a chapter to get pages from
 */
export default function useChapterFetcher(
  args: Pick<
    FetchPagesByChapterPayload,
    'availableChapters' | 'manga' | 'chapter'
  >,
) {
  const dispatch = useAppDispatch();
  const source = MangaHost.getAvailableSources().get(args.manga.source);
  const localRealm = useLocalRealm();
  if (source == null) throw Error(`${args.manga.source} does not exist`);
  const fetchPages = React.useCallback(
    (
      chapter: ChapterSchema,
      callback?: (() => void) | null,
      mockError = false,
    ) => {
      if (
        fetchedChapters.has(chapter._id) ||
        fetchingChapters.has(chapter._id)
      ) {
        return;
      }
      const awaitingFetch = dispatch(
        fetchPagesByChapter({
          source,
          localRealm,
          chapter,
          manga: args.manga,
          availableChapters: args.availableChapters,
          mockError,
        }),
      );
      const netListener = NetInfo.addEventListener(
        ({ isInternetReachable }) => {
          if (!isInternetReachable) {
            awaitingFetch.abort();
            netListener();
          }
        },
      );
      if (callback) awaitingFetch.finally(callback);
      return {
        abort: () => {
          netListener();
          awaitingFetch.abort();
        },
      };
    },
    [source, localRealm, args.manga, args.availableChapters],
  );

  /**
   * Initially fetches the chapter and cancels fetch request if there are any changes to internet availability
   */
  React.useEffect(() => {
    const p = fetchPages(args.chapter);

    return () => {
      p?.abort();
      dispatch(resetReaderState());
    };
  }, []);

  /**
   * This reacts to changes in internet availability
   */
  React.useEffect(() => {
    let p: ReturnType<typeof fetchPages>;
    const listener = NetInfo.addEventListener((e) => {
      if (e.isInternetReachable) {
        const nextChapter = args.availableChapters[args.chapter.index - 1];
        if (nextChapter != null) {
          p = fetchPages(nextChapter);
        }
      }
    });
    return () => {
      p?.abort();
      listener();
    };
  }, []);

  /**
   * Automatically fetch next chapter
   */
  React.useEffect(() => {
    const nextChapter = args.availableChapters[args.chapter.index - 1];
    if (nextChapter != null) {
      const p = fetchPages(nextChapter);
      return () => {
        p?.abort();
      };
    }
  }, [args.chapter._id]);
  return fetchPages;
}
