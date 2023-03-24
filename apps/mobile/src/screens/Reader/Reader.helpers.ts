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
  } = arg;
  function saveScrollPosition() {
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
      // Detect whether the selected chapter is NOT the first chapter and has not been read
      if (
        chapterRef.current.index < readableChapters.length - 1 &&
        (chapterRef.current.scrollPositionLandscape === 0 ||
          chapterRef.current.scrollPositionPortrait === 0)
      ) {
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
      if (chapterRef.current._id !== chapterKey) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const previousChapter = localRealm.objectForPrimaryKey(
          ChapterSchema,
          chapterRef.current._id,
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
