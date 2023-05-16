import Box from '@components/Box';
import Progress from '@components/Progress';
import {
  useLocalObject,
  useLocalQuery,
  useLocalRealm,
  useObject,
  useRealm,
} from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaSchema } from '@database/schemas/Manga';
import useMangaSource from '@hooks/useMangaSource';
import {
  ExtendedReaderState,
  fetchPagesByChapter as _fetchPagesByChapter,
  Page,
  TransitionPage as ITransitionPage,
} from '@redux/slices/reader/reader';
import NetInfo from '@react-native-community/netinfo';
import {
  ReaderScreenOrientation,
  ReadingDirection,
} from '@redux/slices/settings';
import ChapterPage from '@screens/Reader/components/ChapterPage';
import {
  ChapterPageContext,
  removeURLParams,
} from '@screens/Reader/components/ChapterPage/ChapterPage';
import { ImageMenuMethods } from '@screens/Reader/components/ImageMenu/ImageMenu.interfaces';
import NoMorePages from '@screens/Reader/components/NoMorePages';
import Overlay from '@screens/Reader/components/Overlay';
import TransitionPage from '@screens/Reader/components/TransitionPage';
import { TransitionPageContext } from '@screens/Reader/components/TransitionPage/TransitionPage';
import {
  chapterKeyEffect,
  initializeReaderRefs,
  readerCurrentPageEffect,
  readerInitializer,
  readerScrollPositionInitialHandler,
  scrollPositionReadingDirectionChangeHandler,
  readerPreviousChapterScrollPositionHandler,
  handleOrientation,
} from '@screens/Reader/Reader.helpers';
import React from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewabilityConfigCallbackPairs,
  ViewToken,
  ListRenderItem,
  Dimensions,
  Alert,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  Easing,
  runOnJS,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import connector, { ConnectedReaderProps } from './Reader.redux';
import ChapterError from '@screens/Reader/components/ChapterError';
import { ChapterErrorContext } from '@screens/Reader/components/ChapterError/ChapterError';
import {
  FlashList,
  ListRenderItem as FlashListRenderItem,
} from '@shopify/flash-list';
import { useAppDispatch } from '@redux/main';
import useImmersiveMode from '@hooks/useImmersiveMode';
import useScreenDimensions from '@hooks/useScreenDimensions';
import { FlatList, ScrollView } from '@stream-io/flat-list-mvcp';
import useBoolean from '@hooks/useBoolean';
import useMountedEffect from '@hooks/useMountedEffect';

export interface ReaderContextState {
  mangaKey?: string;
}

export const ReaderContext = React.createContext<ReaderContextState>({
  mangaKey: undefined,
});
export const useReaderContext = () => React.useContext(ReaderContext);

const Reader: React.FC<ConnectedReaderProps> = (props) => {
  const {
    chapter: chapterKey,
    showTransitionPage,
    setShowTransitionPage,
    // notifyOnLastChapter,
    incognito,
    pageInDisplay,
    setIsOnChapterError,
    setPageInDisplay,
    isOnChapterError,
    reversed: globalReversed,
    pagingEnabled: globalPagingEnabled,
    resetReaderState,
    setCurrentChapter,
    horizontal: globalHorizontal,
    pages,
    backgroundColor,
    manga: mangaKey,
    chapterInfo: _chapterInfo,
    globalReadingDirection,
    globalDeviceOrientation,
    setIsMounted,
    extendedState,
  } = props;
  const [showStatusAndNavBar, hideStatusAndNavBar] =
    useImmersiveMode(backgroundColor);
  const realm = useRealm();
  const dispatch = useAppDispatch();
  const fetchPagesByChapter = (
    ...args: Parameters<typeof _fetchPagesByChapter>
  ) => {
    const awaitingFetch = dispatch(_fetchPagesByChapter(...args));
    const netListener = NetInfo.addEventListener(({ isInternetReachable }) => {
      if (!isInternetReachable) awaitingFetch.abort();
    });
    return {
      abort: () => {
        netListener();
        awaitingFetch.abort();
      },
    };
  };
  const { width, height } = useScreenDimensions();
  const localRealm = useLocalRealm();
  const manga = useObject(MangaSchema, mangaKey);
  const _chapter = useLocalObject(ChapterSchema, chapterKey);
  const collection = useLocalQuery(ChapterSchema);
  if (manga == null)
    throw Error(
      `Manga does not exist. This error is thrown because it will not be possible to get next chapters without an existing manga object.\nThe value of mangaKey is: ${mangaKey}`,
    );
  if (_chapter == null)
    throw Error(
      'Chapter does not exist. This error is thrown because data about the chapter is null. The user should fetch the manga first before reading a chapter.',
    );

  const [chapter, setChapter] = React.useState(_chapter);
  const [networkChange, toggleNetworkChange] = useBoolean();
  const [transitionPage, setTransitionPage] =
    React.useState<ITransitionPage | null>(null);

  const readableChapters = React.useMemo(
    () =>
      [
        ...collection
          .filtered(
            `language == "${chapter.language}" && _mangaId == "${chapter._mangaId}"`,
          )
          .sorted('index'),
      ] as (ChapterSchema & Realm.Object<ChapterSchema, never>)[],
    [chapter.language, chapter._mangaId, collection],
  );

  const {
    scrollPositionLandscape,
    scrollPositionLandscapeUnsafe,
    scrollPositionPortrait,
    scrollPositionPortraitUnsafe,
    chapterInfo,
    pagesRef,
    chapterRef,
    shouldTrackScrollPositionRef,
    indexOffset,
    flatListRef,
    index,
    memoizedOffsets,
    fetchedPreviousChapter,
    isMounted,
  } = initializeReaderRefs({ _chapter, _chapterInfo, pages });

  React.useEffect(() => {
    chapterInfo.current = _chapterInfo;
  }, [_chapterInfo]);
  const reversed = React.useMemo(
    () =>
      manga.readerDirection != null
        ? manga.readerDirection === 'Use global setting'
          ? globalReversed
          : manga.readerDirection === ReadingDirection.RIGHT_TO_LEFT
        : true,
    [manga.readerDirection, globalReversed],
  );
  const lockOrientation = React.useMemo(
    () =>
      manga.readerLockOrientation != null
        ? manga.readerLockOrientation === 'Use global setting'
          ? globalDeviceOrientation
          : manga.readerLockOrientation
        : ReaderScreenOrientation.FREE,
    [globalDeviceOrientation, manga.readerLockOrientation],
  );
  const horizontal = React.useMemo(
    () =>
      manga.readerDirection != null
        ? manga.readerDirection === 'Use global setting'
          ? globalHorizontal
          : manga.readerDirection === ReadingDirection.RIGHT_TO_LEFT ||
            manga.readerDirection === ReadingDirection.LEFT_TO_RIGHT
        : true,
    [manga.readerDirection, globalHorizontal],
  );
  const pagingEnabled = React.useMemo(
    () =>
      manga.readerDirection != null
        ? manga.readerDirection === 'Use global setting'
          ? globalPagingEnabled
          : manga.readerDirection !== ReadingDirection.WEBTOON
        : true,
    [manga.readerDirection, globalPagingEnabled],
  );
  const readingDirection = React.useMemo(
    () =>
      manga.readerDirection != null
        ? manga.readerDirection === 'Use global setting'
          ? globalReadingDirection
          : manga.readerDirection
        : ReadingDirection.RIGHT_TO_LEFT,
    [manga.readerDirection, globalReadingDirection],
  );

  const persistentForceScrollToOffset = () => {
    let interval: NodeJS.Timer | null = null;
    return {
      scrollToOffset(offset: number) {
        interval = setInterval(() => {
          flatListRef.current?.scrollToOffset({ offset, animated: false });
          if (
            Dimensions.get('screen').width > Dimensions.get('screen').height &&
            offset - scrollPositionLandscapeUnsafe.current <= 100
          )
            this.stopScrollingToOffset();
          else if (offset - scrollPositionPortraitUnsafe.current <= 100)
            this.stopScrollingToOffset();
        }, 15);
      },
      stopScrollingToOffset() {
        if (interval != null) {
          clearInterval(interval);
          interval = null;
        }
      },
    };
  };

  chapterKeyEffect({
    chapterKey,
    localRealm,
    setChapter,
    chapterRef,
    indexOffset,
    getOffset,
    scrollPositionLandscape,
    scrollPositionPortrait,
    incognito,
  });
  readerPreviousChapterScrollPositionHandler({
    forceScrollToOffset,
    pagesRef,
    pages,
    indexOffset,
    chapterKey,
    scrollPositionLandscapeUnsafe,
    scrollPositionPortraitUnsafe,
    getOffset,
    fetchedPreviousChapter,
    memoizedOffsets,
    isHorizontal: horizontal,
    persistentForceScrollToOffset,
  });

  const setShouldTrackScrollPosition = React.useCallback(
    (value: boolean) => {
      setTimeout(() => setShowTransitionPage(value), 15);
      shouldTrackScrollPositionRef.current = value;
    },
    [setShowTransitionPage],
  );

  const [currentPage, setCurrentPage] = React.useState<number>(
    _chapter.indexPage + 1,
  );
  const source = useMangaSource(manga.source);

  const contentContainerStyle = React.useMemo(
    () => [{ backgroundColor: backgroundColor.toLowerCase() }],
    [backgroundColor],
  );
  const overlayOpacity = useSharedValue(0);

  const tapGesture = React.useMemo(
    () =>
      Gesture.Tap()
        .onStart(() => {
          if (overlayOpacity.value > 0) {
            runOnJS(hideStatusAndNavBar)();
            overlayOpacity.value = withTiming(0, {
              duration: 150,
              easing: Easing.ease,
            });
          } else {
            runOnJS(showStatusAndNavBar)();
            overlayOpacity.value = withTiming(1, {
              duration: 150,
              easing: Easing.ease,
            });
          }
        })
        .cancelsTouchesInView(false),
    [],
  );

  handleOrientation(lockOrientation);

  function forceScrollToOffset(offset: number) {
    setTimeout(
      () => flatListRef.current?.scrollToOffset({ offset, animated: false }),
      0,
    );
  }

  readerInitializer({
    _chapter,
    readableChapters,
    scrollPositionLandscapeUnsafe,
    scrollPositionPortraitUnsafe,
    indexOffset,
    localRealm,
    readingDirection,
    setCurrentChapter,
    manga,
    source,
    realm,
    fetchPagesByChapter,
    resetReaderState,
    chapterKey,
    forceScrollToOffset,
    setIsMounted,
  });

  readerScrollPositionInitialHandler({
    setShouldTrackScrollPosition,
    persistentForceScrollToOffset,
    readableChapters,
    scrollPositionLandscape,
    scrollPositionPortrait,
    indexOffset,
    getOffset,
    localRealm,
    readingDirection,
    chapterRef,
    realm,
    manga,
    isOnChapterError,
    pages,
  });

  scrollPositionReadingDirectionChangeHandler({
    getOffset,
    horizontal,
    forceScrollToOffset,
    persistentForceScrollToOffset,
  });

  readerCurrentPageEffect({
    realm,
    manga,
    localRealm,
    chapterRef,
    _chapter,
    currentPage,
  });

  function getOffset(startIndex = 0, toIndex: number = index.current) {
    if (toIndex < startIndex)
      throw Error('toIndex cannot be less than startIndex');
    if (toIndex > pagesRef.current.length - 1)
      throw Error('toIndex cannot exceed the list length');
    switch (readingDirection) {
      case ReadingDirection.WEBTOON: {
        const memoized = memoizedOffsets.current.get(
          `${startIndex}-${toIndex}`,
        );
        if (memoized == null) {
          let offset = 0;
          for (let i = startIndex; i < toIndex; i++) {
            const item = pagesRef.current[i];
            offset +=
              item.type === 'PAGE'
                ? item.height * (width / item.width)
                : height;
          }
          memoizedOffsets.current.set(`${startIndex}-${toIndex}`, offset);
          return offset;
        }
        return memoized;
      }
      case ReadingDirection.RIGHT_TO_LEFT:
      case ReadingDirection.LEFT_TO_RIGHT:
        return width * (toIndex - startIndex);
      case ReadingDirection.VERTICAL:
        return height * (toIndex - startIndex);
      default:
        console.warn(
          `No method of returning to index after reading direction switch for ${readingDirection}`,
        );
        return 0;
    }
  }

  function fetchWithPageInDisplay(args: {
    pageInDisplay: NonNullable<typeof pageInDisplay>;
    manga: NonNullable<typeof manga>;
  }) {
    const { pageInDisplay, manga } = args;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const pageChapter = localRealm.objectForPrimaryKey(
      ChapterSchema,
      pageInDisplay.chapter,
    )!; // This will never be null
    /**
     * This code block will fetch the next chapter immediately
     */
    if (
      pageChapter.index !== 0 &&
      !chapterInfo.current[readableChapters[pageChapter.index - 1]._id]
        ?.alreadyFetched &&
      !chapterInfo.current[readableChapters[pageChapter.index - 1]._id]?.loading
    ) {
      const promise = fetchPagesByChapter({
        chapter: readableChapters[pageChapter.index - 1],
        availableChapters: readableChapters,
        localRealm,
        source,
        offsetIndex: indexOffset,
        manga,
      });
      return () => {
        promise.abort();
      };
    }
  }

  React.useEffect(() => {
    if (pageInDisplay != null) fetchWithPageInDisplay({ pageInDisplay, manga });
  }, [pageInDisplay]);

  useMountedEffect(() => {
    if (networkChange) {
      toggleNetworkChange(false);
      const isOnNextTransitionPage =
        transitionPage != null &&
        chapterRef.current.numberOfPages != null &&
        chapterRef.current.index - 1 === transitionPage.next.index;
      if (pageInDisplay != null)
        fetchWithPageInDisplay({ pageInDisplay, manga });
      else if (isOnNextTransitionPage)
        fetchWithTransitionPage({
          transitionPage,
          manga,
          whichChapterToFetch: 'next',
        });
      else if (!isOnChapterError) {
        /**
         * This probably means the user has not loaded the reader yet and disrupted initial fetch
         */
        const promise = fetchPagesByChapter({
          chapter,
          availableChapters: readableChapters,
          localRealm,
          source,
          offsetIndex: indexOffset,
          manga,
        });
        return () => {
          promise.abort();
        };
      }
    }
  }, [networkChange]);

  React.useEffect(() => {
    /**
     * This will rerun fetching pages if it has been disrupted somehow (e.g. switching networks while fetching)
     */
    const subscription = NetInfo.addEventListener(
      ({ isConnected, isInternetReachable }) => {
        if (isConnected && isInternetReachable && isMounted.current)
          toggleNetworkChange(true);
      },
    );
    isMounted.current = true;
    return () => {
      subscription();
    };
  }, []);

  function fetchWithTransitionPage(args: {
    transitionPage: NonNullable<typeof transitionPage>;
    manga: NonNullable<typeof manga>;
    whichChapterToFetch: 'next' | 'previous';
  }) {
    const { transitionPage, manga, whichChapterToFetch } = args;
    const p = localRealm.objectForPrimaryKey(
      ChapterSchema,
      transitionPage[whichChapterToFetch]._id,
    );
    if (
      p != null &&
      !chapterInfo.current[transitionPage[whichChapterToFetch]._id]
        ?.alreadyFetched &&
      !chapterInfo.current[transitionPage[whichChapterToFetch]._id]?.loading
    ) {
      const promise = fetchPagesByChapter({
        chapter: p,
        availableChapters: readableChapters,
        localRealm,
        source,
        offsetIndex: indexOffset,
        fetchedPreviousChapter:
          whichChapterToFetch === 'previous'
            ? fetchedPreviousChapter
            : undefined,
        manga,
      });
      return () => {
        promise.abort();
      };
    }
  }

  React.useEffect(() => {
    /**
     * User should decide to fetch on transition page
     * But for better UX, fetch the next chapter immediately...
     * In the case the next chapter is not fetched, however, this will run when the user reaches this
     */
    if (
      transitionPage != null &&
      chapterRef.current.numberOfPages != null &&
      chapterRef.current.index - 1 === transitionPage.next.index
    ) {
      setCurrentPage(chapterRef.current.numberOfPages);
      fetchWithTransitionPage({
        manga,
        transitionPage,
        whichChapterToFetch: 'next',
      }); // Fetches next chapter
    } else if (
      transitionPage != null &&
      chapterRef.current.index + 1 === transitionPage.previous.index
    ) {
      setCurrentPage(1);
      fetchWithTransitionPage({
        manga,
        transitionPage,
        whichChapterToFetch: 'previous',
      }); // Fetches previous chapter
    }
  }, [transitionPage]);

  const handleOnViewableItemsChanged = async (info: {
    viewableItems: ViewToken[];
    changed: ViewToken[];
  }) => {
    const page = info.viewableItems[0];
    if (page != null) {
      const item = page.item as Page;
      index.current = page.index ?? index.current;
      // console.log(JSON.stringify(indexOffset, null, 2));
      // console.log(`Current index page: ${index.current}`);
      if (
        item.type === 'CHAPTER_ERROR' &&
        shouldTrackScrollPositionRef.current
      ) {
        setIsOnChapterError(true);
        const chapter = localRealm.objectForPrimaryKey(
          ChapterSchema,
          item.chapter,
        );
        if (chapter && chapterRef.current.index + 1 === chapter.index)
          setCurrentPage(1);
        if (
          chapter &&
          chapterRef.current.index - 1 === chapter.index &&
          chapterRef.current.numberOfPages
        )
          setCurrentPage(chapterRef.current.numberOfPages);
      } else setIsOnChapterError(false);
      if (item.type === 'PAGE') {
        setPageInDisplay({
          parsedKey: removeURLParams(item.page),
          url: item.page,
          chapter: item.chapter,
        });
      }

      if (item.type === 'PAGE' && shouldTrackScrollPositionRef.current) {
        setCurrentPage(item.pageNumber);
        if (item.chapter !== chapterRef.current._id)
          setCurrentChapter(item.chapter);
      }
      if (item.type === 'NO_MORE_PAGES') {
        if (chapterRef.current.numberOfPages != null)
          setCurrentPage(chapterRef.current.numberOfPages);
        overlayOpacity.value = withTiming(1, {
          duration: 150,
          easing: Easing.ease,
        });
      }
      if (
        item.type === 'TRANSITION_PAGE' &&
        shouldTrackScrollPositionRef.current
      ) {
        setTransitionPage(item);
      }
    }
  };

  const viewabilityConfigCallbackPairs =
    React.useRef<ViewabilityConfigCallbackPairs>([
      {
        onViewableItemsChanged: handleOnViewableItemsChanged,
        viewabilityConfig: {
          viewAreaCoveragePercentThreshold: 99,
          waitForInteraction: false,
          minimumViewTime: 0,
        },
      },
    ]);

  function getSafeScrollPosition(input: number) {
    return Math.max(
      input,
      pages[0]?.type === 'TRANSITION_PAGE' ? (horizontal ? width : height) : 0,
    );
  }

  const handleOnScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { width, height } = e.nativeEvent.layoutMeasurement;
    const isPortrait = height > width;
    const offset = horizontal
      ? e.nativeEvent.contentOffset.x
      : e.nativeEvent.contentOffset.y;

    if (isPortrait) {
      scrollPositionPortraitUnsafe.current = offset;
      scrollPositionLandscapeUnsafe.current = (offset / width) * height;
      scrollPositionPortrait.current = getSafeScrollPosition(offset);
      scrollPositionLandscape.current = getSafeScrollPosition(
        scrollPositionLandscapeUnsafe.current,
      );
    } else {
      scrollPositionLandscapeUnsafe.current = offset;
      scrollPositionPortraitUnsafe.current = (offset / width) * height;
      scrollPositionLandscape.current = getSafeScrollPosition(offset);
      scrollPositionPortrait.current = getSafeScrollPosition(
        scrollPositionPortraitUnsafe.current,
      );
    }
  };

  const getItemLayout = React.useCallback(
    (data: Page[] | null | undefined, index: number) => {
      if (data == null)
        return {
          index,
          offset: (horizontal ? width : height) * index,
          length: horizontal ? width : height,
        };

      switch (readingDirection) {
        case ReadingDirection.WEBTOON:
          // eslint-disable-next-line no-case-declarations
          const page = data[index];
          // eslint-disable-next-line no-case-declarations
          let offset = 0;
          for (let i = 0; i < index; i++) {
            const p = data[i];
            switch (p.type) {
              case 'PAGE':
                offset += p.height * (width / p.width);
                break;
              default:
                offset += height;
                break;
            }
          }
          return {
            index,
            offset,
            length:
              page.type === 'PAGE'
                ? page.height * (width / page.width)
                : height,
          };
        case ReadingDirection.LEFT_TO_RIGHT:
        case ReadingDirection.RIGHT_TO_LEFT:
        default:
          return { index, offset: width * index, length: width };
        case ReadingDirection.VERTICAL:
          return {
            index,
            offset: height * index,
            length: height,
          };
      }
    },
    [readingDirection, horizontal, width, height],
  );

  function getItemSize(item: Page) {
    switch (readingDirection) {
      case ReadingDirection.LEFT_TO_RIGHT:
      case ReadingDirection.RIGHT_TO_LEFT:
        return width;
      case ReadingDirection.VERTICAL:
        return height;
      case ReadingDirection.WEBTOON:
        switch (item.type) {
          case 'PAGE':
            return item.height * (width / item.width);
          default:
            return height;
        }
    }
  }

  function overrideItemLayout(
    layout: {
      span?: number | undefined;
      size?: number | undefined;
    },
    item: Page,
  ) {
    layout.size = getItemSize(item);
  }

  const isOnFirstChapter =
    readableChapters[readableChapters.length - 1].index === _chapter.index;

  const renderItem: ListRenderItem<Page> = React.useCallback(
    ({ item, index }) => {
      switch (item.type) {
        case 'PAGE':
          return (
            <ChapterPage
              page={item}
              index={index}
              extendedPageState={extendedState[item.page]}
            />
          );
        case 'TRANSITION_PAGE':
          return <TransitionPage page={item} />;
        case 'NO_MORE_PAGES':
          return <NoMorePages />;
        case 'CHAPTER_ERROR':
          return <ChapterError error={item} />;
      }
    },
    [extendedState],
  );

  return (
    <ChapterPageContext.Provider
      value={React.useMemo(
        () => ({
          tapGesture,
          readingDirection,
          sourceName: source.getName(),
          mangaTitle: manga.title,
        }),
        [tapGesture, readingDirection, source.getName(), manga.title],
      )}
    >
      <TransitionPageContext.Provider
        value={React.useMemo(
          () => ({
            backgroundColor,
            currentChapter: chapter,
            tapGesture,
            showTransitionPage,
          }),
          [backgroundColor, chapter._id, tapGesture, showTransitionPage],
        )}
      >
        <ChapterErrorContext.Provider
          value={React.useMemo(
            () => ({
              availableChapters: readableChapters,
              localRealm,
              offsetIndex: indexOffset,
              source,
              manga,
            }),
            [readableChapters, localRealm, indexOffset, source, manga],
          )}
        >
          <Overlay
            currentPage={currentPage}
            manga={manga}
            chapter={chapter}
            opacity={overlayOpacity}
            mangaTitle={manga.title}
          />
          <GestureDetector gesture={tapGesture}>
            {pages.length === 0 ? (
              <Box
                flex-grow
                align-items="center"
                justify-content="center"
                width={width}
                height={height}
                background-color={backgroundColor.toLowerCase()}
              >
                <Progress />
              </Box>
            ) : (
              <Box minWidth={width} minHeight={height} height="100%">
                {horizontal ? (
                  <FlashList
                    ref={flatListRef as any}
                    // FlatList Props
                    // updateCellsBatchingPeriod={10}
                    // getItemLayout={getItemLayout}
                    // windowSize={13}
                    // maxToRenderPerBatch={50}
                    // contentContainerStyle={contentContainerStyle}
                    // initialScrollIndex={
                    //   _chapter.indexPage + (isOnFirstChapter ? 0 : 1)
                    // }
                    // FlashList props
                    extraData={extendedState}
                    maintainVisibleContentPosition={{
                      autoscrollToTopThreshold: 10,
                      minIndexForVisible: 1,
                    }}
                    estimatedFirstItemOffset={!isOnFirstChapter ? width : 0}
                    initialScrollIndex={_chapter.indexPage}
                    drawDistance={width}
                    estimatedItemSize={width}
                    getItemType={getItemType}
                    overrideItemLayout={overrideItemLayout}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleOnScroll}
                    viewabilityConfigCallbackPairs={
                      viewabilityConfigCallbackPairs.current
                    }
                    horizontal
                    data={pages}
                    inverted={reversed}
                    renderItem={flashListRenderItem}
                    keyExtractor={keyExtractor}
                    pagingEnabled={pagingEnabled}
                  />
                ) : (
                  <FlatList
                    ref={flatListRef}
                    maintainVisibleContentPosition={{
                      autoscrollToTopThreshold: 10,
                      minIndexForVisible: 1,
                    }}
                    updateCellsBatchingPeriod={10}
                    getItemLayout={getItemLayout}
                    windowSize={13}
                    maxToRenderPerBatch={50}
                    contentContainerStyle={contentContainerStyle}
                    initialScrollIndex={
                      _chapter.indexPage + (isOnFirstChapter ? 0 : 1)
                    }
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleOnScroll}
                    viewabilityConfigCallbackPairs={
                      viewabilityConfigCallbackPairs.current
                    }
                    data={pages}
                    inverted={reversed}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    pagingEnabled={pagingEnabled}
                  />
                )}
              </Box>
            )}
          </GestureDetector>
        </ChapterErrorContext.Provider>
      </TransitionPageContext.Provider>
    </ChapterPageContext.Provider>
  );
};

const getItemType: (
  item: Page,
  index: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraData?: any,
) => string | number | undefined = (item) => item.type;

const keyExtractor = (p: Page) => {
  switch (p.type) {
    case 'PAGE':
      return `${p.page}.${p.pageNumber}`;
    case 'TRANSITION_PAGE':
      return `${p.previous._id}${p.next._id}`;
    case 'CHAPTER_ERROR':
      return `${p.chapter}.error=${p.error}`;
    case 'NO_MORE_PAGES':
      return 'no more pages';
  }
};

const flashListRenderItem: FlashListRenderItem<Page> = ({
  item,
  index,
  extraData: _extraData,
}) => {
  const extraData: ExtendedReaderState = _extraData;
  switch (item.type) {
    case 'PAGE':
      return (
        <ChapterPage
          page={item}
          index={index}
          extendedPageState={extraData[item.page]}
        />
      );
    case 'TRANSITION_PAGE':
      return <TransitionPage page={item} />;
    case 'NO_MORE_PAGES':
      return <NoMorePages />;
    case 'CHAPTER_ERROR':
      return <ChapterError error={item} />;
  }
};

export default connector(Reader);
