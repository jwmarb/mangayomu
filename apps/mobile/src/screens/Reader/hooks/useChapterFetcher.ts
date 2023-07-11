import { AppState, useAppDispatch } from '@redux/main';
import {
  FetchPagesByChapterPayload,
  Page,
  fetchPagesByChapter,
  fetchedChapters,
  fetchingChapters,
  resetReaderState,
} from '@redux/slices/reader/reader';
import NetInfo, {
  NetInfoChangeHandler,
  NetInfoStateType,
  NetInfoSubscription,
} from '@react-native-community/netinfo';
import React from 'react';
import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaHost } from '@mangayomu/mangascraper/src';
import { useLocalRealm } from '@database/main';
import { InteractionManager } from 'react-native';
import { AutoFetchThreshold, AutoFetchType } from '@redux/slices/settings';
import useMutableObject from '@hooks/useMutableObject';
import useCancellable from '@screens/Reader/hooks/useCancellable';

/**
 * A hook to create a fetcher to fetch a chapter
 * @param args Args necessary to execute the fetcher
 * @returns Returns a simple fetch function that accepts a chapter to get pages from
 */
export default function useChapterFetcher(
  args: Pick<
    FetchPagesByChapterPayload,
    'availableChapters' | 'manga' | 'chapter'
  > & {
    pages: Page[];
    autoFetch: AppState['settings']['reader']['automaticallyFetchNextChapter'];
    currentPage: number;
    cancellable: ReturnType<typeof useCancellable>[0];
  },
) {
  const dispatch = useAppDispatch();
  const source = MangaHost.sourcesMap.get(args.manga.source);
  const currentChapter = useMutableObject(args.chapter);
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

  React.useEffect(() => {
    let listener: NetInfoSubscription | null = null;
    switch (args.autoFetch.type) {
      case AutoFetchType.ALWAYS:
      case AutoFetchType.WIFI_ONLY:
        listener = NetInfo.addEventListener((e) => {
          if (
            e.type === NetInfoStateType.wifi ||
            args.autoFetch.type === AutoFetchType.ALWAYS
          ) {
            let offsetTillFetch = 0;
            switch (args.autoFetch.thresholdPosition) {
              case AutoFetchThreshold.AT_END:
                if (currentChapter.current.numberOfPages)
                  offsetTillFetch = Math.max(
                    0,
                    currentChapter.current.numberOfPages -
                      args.autoFetch.pageThreshold -
                      args.currentPage,
                  );
                break;
              case AutoFetchThreshold.AT_START:
                offsetTillFetch = Math.max(
                  0,
                  args.autoFetch.pageThreshold - args.currentPage,
                );
                break;
            }
            if (offsetTillFetch === 0 && currentChapter.current.index > 0)
              args.cancellable(fetchPages, {
                previous: {
                  index: currentChapter.current.index,
                  _id: currentChapter.current._id,
                },
                next: {
                  index:
                    args.availableChapters[currentChapter.current.index - 1]
                      .index,
                  _id: args.availableChapters[currentChapter.current.index - 1]
                    ._id,
                },
              });
          }
        });
        break;
    }
    return () => {
      if (listener != null) listener();
    };
  }, [args.autoFetch, args.currentPage]);

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

  return fetchPages;
}
