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
import { useLocalRealm, useRealm } from '@database/main';
import { InteractionManager } from 'react-native';
import { AutoFetchThreshold, AutoFetchType } from '@redux/slices/settings';
import useMutableObject from '@hooks/useMutableObject';
import useCancellable from '@screens/Reader/hooks/useCancellable';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import { useUser } from '@realm/react';
import useAppSelector from '@hooks/useAppSelector';

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
    currentPage: number;
    cancellable: ReturnType<typeof useCancellable>[0];
    chapterWithData: ChapterSchema;
    chapter: LocalChapterSchema;
  },
) {
  const autoFetch = useAppSelector(
    (state) => state.settings.reader.automaticallyFetchNextChapter,
  );
  const dispatch = useAppDispatch();
  const source = MangaHost.sourcesMap.get(args.manga.source);
  const currentChapter = useMutableObject(args.chapterWithData);
  const currentLocalChapter = useMutableObject(args.chapter);
  const localRealm = useLocalRealm();
  const realm = useRealm();
  const user = useUser();
  if (source == null) throw Error(`${args.manga.source} does not exist`);
  const fetchPages = React.useCallback(
    (chapter: LocalChapterSchema, mockError = false) => {
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
          realm,
          chapter,
          manga: args.manga,
          availableChapters: args.availableChapters,
          mockError,
          user,
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
    switch (autoFetch.type) {
      case AutoFetchType.ALWAYS:
      case AutoFetchType.WIFI_ONLY:
        listener = NetInfo.addEventListener((e) => {
          if (
            e.type === NetInfoStateType.wifi ||
            autoFetch.type === AutoFetchType.ALWAYS
          ) {
            let offsetTillFetch = 0;
            switch (autoFetch.thresholdPosition) {
              case AutoFetchThreshold.AT_END:
                if (currentChapter.current.numberOfPages)
                  offsetTillFetch = Math.max(
                    0,
                    currentChapter.current.numberOfPages -
                      autoFetch.pageThreshold -
                      args.currentPage,
                  );
                break;
              case AutoFetchThreshold.AT_START:
                offsetTillFetch = Math.max(
                  0,
                  autoFetch.pageThreshold - args.currentPage,
                );
                break;
            }
            if (
              offsetTillFetch === 0 &&
              currentLocalChapter.current.index > 0 &&
              args.availableChapters[currentLocalChapter.current.index] != null
            ) {
              args.cancellable(fetchPages, {
                previous: {
                  index: currentLocalChapter.current.index,
                  _id: currentChapter.current.link,
                },
                next: {
                  index:
                    args.availableChapters[
                      currentLocalChapter.current.index - 1
                    ].index,
                  _id: args.availableChapters[
                    currentLocalChapter.current.index - 1
                  ]._id,
                },
              });
            }
          }
        });
        break;
    }
    return () => {
      if (listener != null) listener();
    };
  }, [autoFetch, args.currentPage]);

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
