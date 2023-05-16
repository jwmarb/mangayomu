/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaSchema } from '@database/schemas/Manga';
import { MangaHost } from '@mangayomu/mangascraper';
import {
  FetchPagesByChapterPayload,
  getCachedReaderPages,
  Page,
  ReaderChapterInfo,
} from '@redux/slices/reader';
import {
  ReaderScreenOrientation,
  ReadingDirection,
} from '@redux/slices/settings';
import React from 'react';
import { Alert, AppState, Dimensions } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import Realm from 'realm';
import RNFetchBlob from 'rn-fetch-blob';
import useScreenDimensions from '@hooks/useScreenDimensions';
import { FlatList } from 'react-native-gesture-handler';
import { useRealm } from '@database/main';
import useUserHistory from '@hooks/useUserHistory';

type ForceScrollToOffset = (offset: number) => void;

type ReaderScrollPositionInitialHandlerArguments = {
  readableChapters: (ChapterSchema & Realm.Object<ChapterSchema, never>)[];
  scrollPositionLandscape: React.MutableRefObject<number>;
  scrollPositionPortrait: React.MutableRefObject<number>;
  indexOffset: React.MutableRefObject<
    Record<
      string,
      {
        start: number;
        end: number;
      }
    >
  >;
  getOffset(startIndex?: number, toIndex?: number): number;
  localRealm: Realm;
  realm: Realm;
  manga: MangaSchema & Realm.Object<MangaSchema, never>;
  readingDirection: ReadingDirection;
  chapterRef: React.MutableRefObject<
    ChapterSchema & Realm.Object<ChapterSchema, never>
  >;
  isOnChapterError: boolean | null;
  setShouldTrackScrollPosition: (value: boolean) => void;
  pages: Page[];
  persistentForceScrollToOffset: () => {
    scrollToOffset: (position: number) => void;
    stopScrollingToOffset: () => void;
  };
};
export function readerScrollPositionInitialHandler(
  arg: ReaderScrollPositionInitialHandlerArguments,
) {
  const { width, height } = useScreenDimensions();
  const {
    chapterRef,
    readingDirection,
    localRealm,
    getOffset,
    indexOffset,
    scrollPositionLandscape,
    scrollPositionPortrait,
    persistentForceScrollToOffset,
    readableChapters,
    isOnChapterError,
    setShouldTrackScrollPosition,
    pages,
  } = arg;
  const scrollHelper = React.useRef<
    ReturnType<typeof persistentForceScrollToOffset>
  >(persistentForceScrollToOffset());
  function saveScrollPosition() {
    if (isOnChapterError || isOnChapterError == null) {
      console.log(
        isOnChapterError === true
          ? 'The user is on a chapter error, therefore saving scroll position on that chapter will not occur.'
          : 'The user is on a chapter error, however, it has a null value. No saving scroll position will take place.',
      );
      return;
    }
    const startOffset = getOffset(
      0,
      indexOffset.current[chapterRef.current._id].start,
    );
    const endOffset = getOffset(
      indexOffset.current[chapterRef.current._id].start,
      indexOffset.current[chapterRef.current._id].end + 1,
    );

    // console.log(
    //   `Saved scroll position at ${Math.min(
    //     Math.max(scrollPositionPortrait.current - startOffset, 0),
    //     endOffset,
    //   )}`,
    // );

    localRealm.write(() => {
      localRealm.create<ChapterSchema>(
        'Chapter',
        {
          _id: chapterRef.current._id,
          scrollPositionLandscape: Math.min(
            Math.max(scrollPositionLandscape.current - startOffset, 0),
            endOffset,
          ),
          scrollPositionPortrait: Math.min(
            Math.max(scrollPositionPortrait.current - startOffset, 0),
            endOffset,
          ),
        },
        Realm.UpdateMode.Modified,
      );
    });
  }
  React.useEffect(() => {
    if (pages.length > 0) {
      let interval: NodeJS.Timer;
      const hasNoSavedScrollPosition =
        chapterRef.current.scrollPositionLandscape === 0 ||
        chapterRef.current.scrollPositionPortrait === 0;

      /**
       * If the user has a saved scroll position, it should return to the saved scroll position.
       *
       * This code block is experimental but will be kept in the future. There is no need for this code block unless the user is on WEBTOON mode.
       */
      if (!hasNoSavedScrollPosition) {
        /**
         * Setting a transition page offset initially is important to prevent the reader from starting at the transition page.
         * This will set to a value depending if the chapter is the first chapter or not.
         */
        let transitionPageOffset = 0;
        // Detect if this is the first chapter.
        if (
          readableChapters[readableChapters.length - 1]._id !==
          chapterRef.current._id
        ) {
          // There is a transition page because this is not the first chapter, so the offset must be set.
          switch (readingDirection) {
            case ReadingDirection.LEFT_TO_RIGHT:
            case ReadingDirection.RIGHT_TO_LEFT:
              transitionPageOffset = width;
              break;
            case ReadingDirection.WEBTOON:
            case ReadingDirection.VERTICAL:
              transitionPageOffset = height;
              break;
          }
        }

        /**
         * After the offset has been initialized, start scrolling back to the saved scroll position
         */
        if (width > height) {
          // const interval =
          scrollHelper.current.scrollToOffset(
            chapterRef.current.scrollPositionLandscape + transitionPageOffset,
          ); // Scrolls to landscape scroll position because the user is in landscape mode
          // return () => {
          //   clearInterval(interval);
          // };
        } else {
          console.log(
            `Scrolling back to saved position at ${
              chapterRef.current.scrollPositionPortrait + transitionPageOffset
            }`,
          );
          scrollHelper.current.scrollToOffset(
            chapterRef.current.scrollPositionPortrait + transitionPageOffset,
          );
        }
      }
      setShouldTrackScrollPosition(true);
      const listener = AppState.addEventListener('change', (appState) => {
        switch (appState) {
          case 'background':
          case 'inactive':
            saveScrollPosition();
            break;
        }
      });
      const timer = setInterval(() => {
        saveScrollPosition();
      }, 1000);

      return () => {
        scrollHelper.current.stopScrollingToOffset();
        clearInterval(timer);
        clearInterval(interval);
        listener.remove();
        saveScrollPosition();
      };
    }
  }, [pages.length === 0]);
}

type ReaderPreviousChapterScrollPositionHandlerArguments = {
  pagesRef: React.MutableRefObject<Page[]>;
  pages: Page[];
  indexOffset: React.MutableRefObject<
    Record<
      string,
      {
        start: number;
        end: number;
      }
    >
  >;
  chapterKey: string;
  scrollPositionLandscapeUnsafe: React.MutableRefObject<number>;
  scrollPositionPortraitUnsafe: React.MutableRefObject<number>;
  getOffset(startIndex?: number, toIndex?: number): number;
  forceScrollToOffset: ForceScrollToOffset;
  fetchedPreviousChapter: React.MutableRefObject<boolean>;
  memoizedOffsets: React.MutableRefObject<Map<string, number>>;
  isHorizontal: boolean;
} & Pick<
  ReaderScrollPositionInitialHandlerArguments,
  'persistentForceScrollToOffset'
>;
export function readerPreviousChapterScrollPositionHandler(
  arg: ReaderPreviousChapterScrollPositionHandlerArguments,
) {
  const {
    getOffset,
    pagesRef,
    pages,
    indexOffset,
    chapterKey,
    memoizedOffsets,
    scrollPositionLandscapeUnsafe,
    scrollPositionPortraitUnsafe,
    forceScrollToOffset,
    fetchedPreviousChapter,
    isHorizontal,
    persistentForceScrollToOffset,
  } = arg;
  const { width, height } = useScreenDimensions();
  const scrollHelper = React.useRef<
    ReturnType<typeof persistentForceScrollToOffset>
  >(persistentForceScrollToOffset());
  React.useEffect(() => {
    pagesRef.current = pages;
    if (fetchedPreviousChapter.current && isHorizontal) {
      memoizedOffsets.current.clear(); // fetching previous chapter renders the current memoized offsets redundant and outdated because the data is shifted n indices
      const offset =
        getOffset(0, indexOffset.current[chapterKey].start - 1) + // Subtract 1 to include the transition page
        (width > height
          ? scrollPositionLandscapeUnsafe
          : scrollPositionPortraitUnsafe
        ).current;

      console.log('Previous chapter detected. Scrolling to offset...');
      Alert.alert('debug', 'Previous chapter detected. Scrolling to offset...');
      fetchedPreviousChapter.current = false;
      // const interval =
      scrollHelper.current.scrollToOffset(offset);
      return () => {
        scrollHelper.current.stopScrollingToOffset();
      };
    } else fetchedPreviousChapter.current = false;
  }, [pages]);
}

interface ReaderInitializerArguments
  extends Pick<
      ReaderScrollPositionInitialHandlerArguments,
      'readableChapters' | 'localRealm' | 'readingDirection' | 'indexOffset'
    >,
    Pick<
      ReaderPreviousChapterScrollPositionHandlerArguments,
      | 'scrollPositionLandscapeUnsafe'
      | 'scrollPositionPortraitUnsafe'
      | 'chapterKey'
    > {
  _chapter: ChapterSchema & Realm.Object<ChapterSchema, never>;
  setCurrentChapter: (payload: string) => {
    payload: string;
    type: 'reader/setCurrentChapter';
  };
  realm: Realm;
  manga: MangaSchema & Realm.Object<MangaSchema, never>;
  fetchPagesByChapter: (arg: FetchPagesByChapterPayload) => {
    abort: () => void;
  };
  source: MangaHost;
  resetReaderState: () => void;
  forceScrollToOffset: ForceScrollToOffset;
  setIsMounted: (val: boolean) => void;
}
export function readerInitializer(args: ReaderInitializerArguments) {
  const {
    resetReaderState,
    source,
    fetchPagesByChapter,
    indexOffset,
    readableChapters,
    manga,
    realm,
    chapterKey,
    setCurrentChapter,
    scrollPositionLandscapeUnsafe,
    scrollPositionPortraitUnsafe,
    readingDirection,
    localRealm,
    _chapter,
    forceScrollToOffset,
    setIsMounted,
  } = args;
  React.useEffect(() => {
    const listener = Dimensions.addEventListener('change', ({ window }) => {
      if (readingDirection !== ReadingDirection.WEBTOON) {
        // const interval =
        forceScrollToOffset(
          (window.width > window.height
            ? scrollPositionLandscapeUnsafe
            : scrollPositionPortraitUnsafe
          ).current,
        );
        // setTimeout(() => clearInterval(interval), 50);
      }
    });

    setIsMounted(true); // no need to put this in cleanup function because this will be handled by resetReaderState();
    setCurrentChapter(chapterKey);
    localRealm.write(() => {
      _chapter.dateRead = Date.now();
    });
    realm.write(() => {
      manga.currentlyReadingChapter = {
        _id: _chapter._id,
        index: _chapter.indexPage,
        /**
         * TODO: Find a work-around for this field to be defined because this will be undefined if this is a new chapter (the user has yet to fetch pages yet)
         */
        numOfPages: _chapter.numberOfPages ?? 20,
      };
    });

    const promise = fetchPagesByChapter({
      chapter: _chapter,
      source,
      availableChapters: readableChapters,
      localRealm,
      offsetIndex: indexOffset,
      manga,
    });
    return () => {
      const readerImageCachePath = getCachedReaderPages(source);
      (async () => {
        const exists = await RNFetchBlob.fs.exists(readerImageCachePath);
        if (exists) await RNFetchBlob.fs.unlink(readerImageCachePath);
      })();
      promise.abort();
      Orientation.unlockAllOrientations();
      resetReaderState();
      listener.remove();
    };
  }, []);
}

type ScrollPositionReadingDirectionChangeHandlerArguments = Pick<
  ReaderScrollPositionInitialHandlerArguments,
  'getOffset' | 'persistentForceScrollToOffset'
> & {
  forceScrollToOffset: ForceScrollToOffset;
  horizontal: boolean;
};

export function scrollPositionReadingDirectionChangeHandler(
  args: ScrollPositionReadingDirectionChangeHandlerArguments,
) {
  const mounted = React.useRef<boolean>(false);
  const {
    getOffset,
    horizontal,
    forceScrollToOffset,
    persistentForceScrollToOffset,
  } = args;
  const scrollHelper = React.useRef<
    ReturnType<typeof persistentForceScrollToOffset>
  >(persistentForceScrollToOffset());
  React.useEffect(() => {
    if (mounted.current) {
      // const interval =
      scrollHelper.current.scrollToOffset(getOffset());
      return () => {
        scrollHelper.current.stopScrollingToOffset();
      };
    } else mounted.current = true;
  }, [horizontal]);
}

type ReaderCurrentPageEffectArguments = Pick<
  ReaderInitializerArguments,
  'realm' | 'manga'
> &
  Pick<
    ReaderScrollPositionInitialHandlerArguments,
    'localRealm' | 'chapterRef'
  > & {
    currentPage: number;
    _chapter: ChapterSchema & Realm.Object<ChapterSchema, never>;
  };
export function readerCurrentPageEffect(
  args: ReaderCurrentPageEffectArguments,
) {
  const { realm, manga, chapterRef, _chapter, currentPage, localRealm } = args;
  React.useEffect(() => {
    realm.write(() => {
      manga.currentlyReadingChapter = {
        _id: chapterRef.current._id,
        index: currentPage - 1,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        numOfPages: chapterRef.current.numberOfPages ?? 20, // This should NOT be null because the user will need to be on the page, which means Chapter exists locally with this property defined
      };
    });
    localRealm.write(() => {
      _chapter.indexPage = currentPage - 1;
    });
  }, [currentPage]);
}

type ChapterKeyEffectArguments = Pick<
  ReaderScrollPositionInitialHandlerArguments,
  | 'localRealm'
  | 'chapterRef'
  | 'getOffset'
  | 'indexOffset'
  | 'scrollPositionLandscape'
  | 'scrollPositionPortrait'
> &
  Pick<ReaderPreviousChapterScrollPositionHandlerArguments, 'chapterKey'> & {
    setChapter: (
      value: ChapterSchema & Realm.Object<ChapterSchema, never>,
    ) => void;
    incognito: boolean;
  };
export function chapterKeyEffect(args: ChapterKeyEffectArguments) {
  const {
    chapterKey,
    localRealm,
    setChapter,
    chapterRef,
    indexOffset,
    getOffset,
    scrollPositionLandscape,
    scrollPositionPortrait,
    incognito,
  } = args;
  const realm = useRealm();
  const { addMangaToHistory } = useUserHistory({ incognito });
  React.useEffect(() => {
    const newChapter = localRealm.objectForPrimaryKey(
      ChapterSchema,
      chapterKey,
    );
    if (newChapter != null) {
      const manga = realm.objectForPrimaryKey(MangaSchema, newChapter._mangaId);
      if (manga != null)
        addMangaToHistory({
          chapter: {
            date: newChapter.date,
            index: newChapter.index,
            link: newChapter.link,
            name: newChapter.name,
          },
          manga: {
            imageCover: manga.imageCover,
            index: manga.index,
            link: manga.link,
            source: manga.source,
            title: manga.title,
          },
        });
      localRealm.write(() => {
        newChapter.dateRead = Date.now();
      });
      /**
       * Whenever a user changes chapters, this code block will run and save the scroll position on the former chapter. This will NOT save scroll position on the current chapter (aka the chapter the user has switched to).
       */
      if (chapterRef.current._id !== chapterKey) {
        // if (isOnChapterError) {
        //   console.log(
        //     `Skipped saving scroll position for ${chapterRef.current._id} because the chapter the user was on has an error.`,
        //   );
        //   return;
        // }
        // console.log(`Saving scroll position on ${chapterRef.current._id}`);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const previousChapter = localRealm.objectForPrimaryKey(
          ChapterSchema,
          chapterRef.current._id,
        )!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const beforeAppendingStateChapter = localRealm.objectForPrimaryKey(
          ChapterSchema,
          chapterKey,
        )!;
        const startOffset = getOffset(
          0,
          indexOffset.current[previousChapter._id].start,
        );
        const endOffset = getOffset(
          indexOffset.current[previousChapter._id].start,
          indexOffset.current[previousChapter._id].end,
        );

        localRealm.write(() => {
          if (
            previousChapter.index - 1 === beforeAppendingStateChapter.index &&
            previousChapter.numberOfPages != null
          ) {
            // this means "beforeAppendingStateChapter" is the next chapter of "previousChapter"
            previousChapter.indexPage = previousChapter.numberOfPages - 1;
          } else if (
            previousChapter.index + 1 ===
            beforeAppendingStateChapter.index
          ) {
            // this means "beforeAppendingStateChapter" is the previous chapter of "previousChapter"
            previousChapter.indexPage = 0;
          }
          previousChapter.scrollPositionLandscape = Math.min(
            Math.max(scrollPositionLandscape.current - startOffset, 0),
            endOffset,
          );
          previousChapter.scrollPositionPortrait = Math.min(
            Math.max(scrollPositionPortrait.current - startOffset, 0),
            endOffset,
          );
        });
      }

      chapterRef.current = newChapter;
      setChapter(newChapter);
    }
  }, [chapterKey]);
}

type InitializeReaderRefsArguments = {
  _chapter: ChapterSchema & Realm.Object<ChapterSchema, never>;
  _chapterInfo: Record<string, ReaderChapterInfo>;
} & Pick<ReaderPreviousChapterScrollPositionHandlerArguments, 'pages'>;
export function initializeReaderRefs(args: InitializeReaderRefsArguments) {
  const { _chapterInfo, _chapter, pages } = args;

  const scrollPositionLandscape = React.useRef<number>(0);
  const scrollPositionPortrait = React.useRef<number>(0);
  const scrollPositionPortraitUnsafe = React.useRef<number>(0);
  const scrollPositionLandscapeUnsafe = React.useRef<number>(0);

  const fetchedPreviousChapter = React.useRef<boolean>(false);
  const memoizedOffsets = React.useRef<Map<string, number>>(new Map());

  const chapterRef = React.useRef<
    ChapterSchema & Realm.Object<ChapterSchema, never>
  >(_chapter);
  const chapterInfo = React.useRef<typeof _chapterInfo>(_chapterInfo);
  const pagesRef = React.useRef<Page[]>(pages);
  const shouldTrackScrollPositionRef = React.useRef<boolean>(false);
  const indexOffset = React.useRef<
    Record<string, { start: number; end: number }>
  >({});
  const flatListRef = React.useRef<FlatList>(null);
  const index = React.useRef<number>(_chapter.indexPage);
  const isMounted = React.useRef<boolean>(false);
  return {
    scrollPositionLandscape,
    scrollPositionPortrait,
    scrollPositionPortraitUnsafe,
    scrollPositionLandscapeUnsafe,
    chapterRef,
    chapterInfo,
    pagesRef,
    shouldTrackScrollPositionRef,
    indexOffset,
    flatListRef,
    index,
    fetchedPreviousChapter,
    memoizedOffsets,
    isMounted,
  };
}

export function handleOrientation(lockOrientation: ReaderScreenOrientation) {
  React.useEffect(() => {
    switch (lockOrientation) {
      case ReaderScreenOrientation.FREE:
        Orientation.unlockAllOrientations();
        break;
      case ReaderScreenOrientation.LANDSCAPE:
        Orientation.lockToLandscape();
        break;
      case ReaderScreenOrientation.PORTRAIT:
        Orientation.lockToPortrait();
        break;
    }
  }, [lockOrientation]);
}
