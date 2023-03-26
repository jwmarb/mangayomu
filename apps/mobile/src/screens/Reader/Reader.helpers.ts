/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaSchema } from '@database/schemas/Manga';
import { MangaHost } from '@mangayomu/mangascraper';
import {
  FetchPagesByChapterPayload,
  Page,
  ReaderChapterInfo,
} from '@redux/slices/reader';
import {
  ReaderScreenOrientation,
  ReadingDirection,
} from '@redux/slices/settings';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import React from 'react';
import {
  AppState,
  Dimensions,
  FlatList,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { SharedValue } from 'react-native-reanimated';
import Realm from 'realm';

type ReaderScrollPositionInitialHandlerArguments = {
  shouldTrackScrollPosition: boolean;
  _chapter: ChapterSchema & Realm.Object<ChapterSchema, never>;
  readableChapters: (ChapterSchema & Realm.Object<ChapterSchema, never>)[];
  horizontal: boolean;
  scrollPositionLandscape: React.MutableRefObject<number>;
  scrollPositionPortrait: React.MutableRefObject<number>;
  transitionPageOpacity: SharedValue<number>;
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
  forceScrollToOffset(offset: number): NodeJS.Timer;
  isOnChapterError: boolean | null;
  setShouldTrackScrollPosition: (value: boolean) => void;
};
export function readerScrollPositionInitialHandler(
  arg: ReaderScrollPositionInitialHandlerArguments,
) {
  const { width, height } = useWindowDimensions();
  const {
    _chapter,
    chapterRef,
    readingDirection,
    localRealm,
    getOffset,
    indexOffset,
    transitionPageOpacity,
    scrollPositionLandscape,
    scrollPositionPortrait,
    shouldTrackScrollPosition,
    forceScrollToOffset,
    readableChapters,
    horizontal,
    isOnChapterError,
    setShouldTrackScrollPosition,
  } = arg;
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
      indexOffset.current[chapterRef.current._id].end,
    );

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
    if (!shouldTrackScrollPosition) {
      const isInFirstChapter =
        chapterRef.current.index < readableChapters.length - 1;
      const hasNoSavedScrollPosition =
        chapterRef.current.scrollPositionLandscape === 0 ||
        chapterRef.current.scrollPositionPortrait === 0;
      /**
       * Detect whether the selected chapter is NOT the first chapter and has not been read
       */

      if (isInFirstChapter && hasNoSavedScrollPosition) {
        const interval = forceScrollToOffset(horizontal ? width : height); // Start the reader at this offset to avoid starting at the transition page
        return () => {
          clearInterval(interval);
        };
      } else {
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
          const interval = forceScrollToOffset(
            chapterRef.current.scrollPositionLandscape + transitionPageOffset,
          ); // Scrolls to landscape scroll position because the user is in landscape mode
          return () => {
            clearInterval(interval);
          };
        } else {
          const interval = forceScrollToOffset(
            chapterRef.current.scrollPositionPortrait + transitionPageOffset,
          ); // Scrolls to portrait scroll position because the useer is in portrait mode
          return () => {
            clearInterval(interval);
          };
        }
      }
    } else {
      transitionPageOpacity.value = 1;
      const listener = AppState.addEventListener('change', (appState) => {
        switch (appState) {
          case 'background':
          case 'inactive':
            saveScrollPosition();
            break;
        }
      });

      return () => {
        listener.remove();
        saveScrollPosition();
      };
    }
  }, [shouldTrackScrollPosition]);
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
  index: React.MutableRefObject<number>;
  scrollPositionLandscapeUnsafe: React.MutableRefObject<number>;
  scrollPositionPortraitUnsafe: React.MutableRefObject<number>;
  getOffset(startIndex?: number, toIndex?: number): number;
  forceScrollToOffset(offset: number): NodeJS.Timer;
};
export function readerPreviousChapterScrollPositionHandler(
  arg: ReaderPreviousChapterScrollPositionHandlerArguments,
) {
  const {
    getOffset,
    pagesRef,
    pages,
    indexOffset,
    chapterKey,
    index,
    scrollPositionLandscapeUnsafe,
    scrollPositionPortraitUnsafe,
    forceScrollToOffset,
  } = arg;
  const { width, height } = useWindowDimensions();
  React.useEffect(() => {
    const pageOnScreen = pagesRef.current[index.current];
    pagesRef.current = pages;
    if (
      chapterKey in indexOffset.current &&
      pagesRef.current[index.current] != null &&
      pageOnScreen != null &&
      pagesRef.current[index.current] !== pageOnScreen
    ) {
      const offset =
        getOffset(0, indexOffset.current[chapterKey].start) +
        (width > height
          ? scrollPositionLandscapeUnsafe
          : scrollPositionPortraitUnsafe
        ).current;

      const interval = forceScrollToOffset(offset);
      return () => {
        clearInterval(interval);
      };
    }
  }, [pages]);
}

interface ReaderInitializerArguments
  extends Pick<
      ReaderScrollPositionInitialHandlerArguments,
      | 'readableChapters'
      | 'localRealm'
      | '_chapter'
      | 'readingDirection'
      | 'indexOffset'
    >,
    Pick<
      ReaderPreviousChapterScrollPositionHandlerArguments,
      | 'scrollPositionLandscapeUnsafe'
      | 'scrollPositionPortraitUnsafe'
      | 'chapterKey'
    > {
  setCurrentChapter: (payload: string) => {
    payload: string;
    type: 'reader/setCurrentChapter';
  };
  realm: Realm;
  manga: MangaSchema & Realm.Object<MangaSchema, never>;
  fetchPagesByChapter: (arg: FetchPagesByChapterPayload) => Promise<any>;
  source: MangaHost;
  resetReaderState: () => void;
  forceScrollToOffset(offset: number): NodeJS.Timer;
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
  } = args;
  React.useEffect(() => {
    const listener = Dimensions.addEventListener('change', ({ window }) => {
      if (readingDirection !== ReadingDirection.WEBTOON) {
        const interval = forceScrollToOffset(
          (window.width > window.height
            ? scrollPositionLandscapeUnsafe
            : scrollPositionPortraitUnsafe
          ).current,
        );
        setTimeout(() => clearInterval(interval), 50);
      }
    });

    setCurrentChapter(chapterKey);
    localRealm.write(() => {
      _chapter.dateRead = Date.now();
    });
    realm.write(() => {
      manga.currentlyReadingChapter = {
        _id: _chapter._id,
        index: _chapter.indexPage,
      };
    });

    fetchPagesByChapter({
      chapter: _chapter,
      source,
      availableChapters: readableChapters,
      localRealm,
      offsetIndex: indexOffset,
    });
    StatusBar.setHidden(true);
    return () => {
      Orientation.unlockAllOrientations();
      resetReaderState();
      listener.remove();
      StatusBar.setHidden(false);
    };
  }, []);
}

type ScrollPositionReadingDirectionChangeHandlerArguments = Pick<
  ReaderScrollPositionInitialHandlerArguments,
  'getOffset' | 'horizontal' | 'forceScrollToOffset'
>;

export function scrollPositionReadingDirectionChangeHandler(
  args: ScrollPositionReadingDirectionChangeHandlerArguments,
) {
  const mounted = React.useRef<boolean>(false);
  const { getOffset, horizontal, forceScrollToOffset } = args;

  React.useEffect(() => {
    if (mounted.current) {
      const interval = forceScrollToOffset(getOffset());
      return () => {
        clearInterval(interval);
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
    'localRealm' | 'chapterRef' | '_chapter'
  > & {
    currentPage: number;
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
  | 'isOnChapterError'
> &
  Pick<ReaderPreviousChapterScrollPositionHandlerArguments, 'chapterKey'> & {
    setChapter: (
      value: ChapterSchema & Realm.Object<ChapterSchema, never>,
    ) => void;
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
    isOnChapterError,
  } = args;
  React.useEffect(() => {
    const newChapter = localRealm.objectForPrimaryKey(
      ChapterSchema,
      chapterKey,
    );
    if (newChapter != null) {
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
