import { useAppDispatch } from '@redux/main';
import {
  FetchPagesByChapterPayload,
  Page,
  fetchPagesByChapter,
  fetchedChapters,
  fetchingChapters,
  resetReaderState,
} from '@redux/slices/reader/reader';
import NetInfo, { NetInfoSubscription } from '@react-native-community/netinfo';
import React from 'react';
import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaHost } from '@mangayomu/mangascraper';
import { useLocalRealm } from '@database/main';
import { InteractionManager } from 'react-native';

/**
 * A hook to create a fetcher to fetch a chapter
 * @param args Args necessary to execute the fetcher
 * @returns Returns a simple fetch function that accepts a chapter to get pages from
 */
export default function useChapterFetcher(
  args: Pick<
    FetchPagesByChapterPayload,
    'availableChapters' | 'manga' | 'chapter'
  > & { pages: Page[] },
) {
  const dispatch = useAppDispatch();
  const source = MangaHost.getAvailableSources().get(args.manga.source);
  const localRealm = useLocalRealm();
  if (source == null) throw Error(`${args.manga.source} does not exist`);
  const fetchPages = React.useCallback(
    (chapter: ChapterSchema, mockError = false) => {
      if (
        fetchedChapters.has(chapter._id) ||
        fetchingChapters.has(chapter._id)
      ) {
        return;
      }
      return dispatch(
        fetchPagesByChapter({
          source,
          localRealm,
          chapter,
          manga: args.manga,
          availableChapters: args.availableChapters,
          mockError,
        }),
      );
    },
    [source, localRealm, args.manga, args.availableChapters],
  );

  React.useEffect(() => {
    return () => {
      dispatch(resetReaderState());
    };
  }, []);

  /**
   * Initially fetches current chapter
   */
  React.useEffect(() => {
    const { then, cancel } = InteractionManager.runAfterInteractions();
    let p: ReturnType<typeof fetchPages>;
    let listener: NetInfoSubscription;
    then(() => {
      listener = NetInfo.addEventListener(() => {
        p = fetchPages(args.chapter);
      });
    });
    return () => {
      cancel();
      listener();
      p?.abort();
    };
  }, []);

  React.useEffect(() => {
    let p: ReturnType<typeof fetchPages>;
    const listener = NetInfo.addEventListener(({ isInternetReachable }) => {
      if (isInternetReachable) {
        const nextChapter = args.availableChapters[args.chapter.index - 1];
        if (nextChapter != null) p = fetchPages(nextChapter);
      }
    });
    return () => {
      listener();
      p?.abort();
    };
  }, [args.chapter._id]);

  return fetchPages;
}
