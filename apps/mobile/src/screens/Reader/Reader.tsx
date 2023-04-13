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
import { PageSchema } from '@database/schemas/Page';
import useMangaSource from '@hooks/useMangaSource';
import { Page } from '@redux/slices/reader/reader';
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
  useWindowDimensions,
  ViewabilityConfigCallbackPairs,
  ViewToken,
  FlatList,
  // ListRenderItem,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ScaledSheet } from 'react-native-size-matters';
import connector, { ConnectedReaderProps } from './Reader.redux';
import Orientation from 'react-native-orientation-locker';
import ChapterError from '@screens/Reader/components/ChapterError';
import { ChapterErrorContext } from '@screens/Reader/components/ChapterError/ChapterError';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
const styles = ScaledSheet.create({
  container: {
    minHeight: '100%',
    minWidth: '100%',
  },
});

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
    notifyOnLastChapter,
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
    fetchPagesByChapter,
    manga: mangaKey,
    chapterInfo: _chapterInfo,
    globalReadingDirection,
    globalDeviceOrientation,
    setIsMounted,
    addMangaToHistory,
  } = props;
  const realm = useRealm();
  const { width, height } = useWindowDimensions();
  const localRealm = useLocalRealm();
  const manga = useObject(MangaSchema, mangaKey);
  const _chapter = useLocalObject(ChapterSchema, chapterKey);
  const collection = useLocalQuery(ChapterSchema);
  if (manga == null)
    throw Error(
      'Manga does not exist. This error is thrown because it will not be possible to get next chapters without an existing manga object.',
    );
  if (_chapter == null)
    throw Error(
      'Chapter does not exist. This error is thrown because data about the chapter is null. The user should fetch the manga first before reading a chapter.',
    );

  const [chapter, setChapter] = React.useState(_chapter);

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
    fetchedPreviousChapter,
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

  chapterKeyEffect({
    chapterKey,
    localRealm,
    setChapter,
    chapterRef,
    indexOffset,
    getOffset,
    scrollPositionLandscape,
    scrollPositionPortrait,
    isOnChapterError,
    addMangaToHistory,
  });
  readerPreviousChapterScrollPositionHandler({
    forceScrollToOffset,
    pagesRef,
    pages,
    indexOffset,
    chapterKey,
    index,
    scrollPositionLandscapeUnsafe,
    scrollPositionPortraitUnsafe,
    getOffset,
    fetchedPreviousChapter,
  });

  const [shouldTrackScrollPosition, _setShouldTrackScrollPosition] =
    React.useState<boolean>(false);
  const setShouldTrackScrollPosition = React.useCallback(
    (value: boolean) => {
      setTimeout(() => setShowTransitionPage(value), 15);
      _setShouldTrackScrollPosition(value);
      shouldTrackScrollPositionRef.current = value;
    },
    [_setShouldTrackScrollPosition, setShowTransitionPage],
  );

  const [currentPage, setCurrentPage] = React.useState<number>(
    _chapter.indexPage + 1,
  );
  const source = useMangaSource(manga.source);
  const imageMenuRef = React.useRef<ImageMenuMethods>(null);

  const contentContainerStyle = React.useMemo(
    () => [
      styles.container,
      { backgroundColor: backgroundColor.toLowerCase() },
    ],
    [styles.container, backgroundColor],
  );
  const overlayOpacity = useSharedValue(0);

  const tapGesture = React.useMemo(
    () =>
      Gesture.Tap()
        .onStart(() => {
          if (overlayOpacity.value > 0) {
            overlayOpacity.value = withTiming(0, {
              duration: 150,
              easing: Easing.ease,
            });
          } else {
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
    forceScrollToOffset,
    shouldTrackScrollPosition,
    _chapter,
    readableChapters,
    horizontal,
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
    switch (readingDirection) {
      case ReadingDirection.WEBTOON: {
        let offset = 0;
        for (let i = startIndex; i < toIndex; i++) {
          const curr = pagesRef.current[i];
          if (curr == null) {
            console.error(
              `page at index ${i} does not exist. startIndex = ${startIndex}. toIndex = ${toIndex}. pages length = ${pagesRef.current.length}`,
            );
            console.log(JSON.stringify(pagesRef.current, null, 2));
          }
          switch (curr.type) {
            case 'PAGE': {
              offset += curr.height * (width / curr.width);
              break;
            }
            default:
              offset += height;
              break;
          }
        }

        return offset;
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
        });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const pageChapter = localRealm.objectForPrimaryKey(
          ChapterSchema,
          item.chapter,
        )!; // This will never be null
        /**
         * This code block will fetch the next chapter immediately
         */
        if (
          pageChapter.index !== 0 &&
          !chapterInfo.current[readableChapters[pageChapter.index - 1]._id]
            ?.alreadyFetched &&
          !chapterInfo.current[readableChapters[pageChapter.index - 1]._id]
            ?.loading
        ) {
          await fetchPagesByChapter({
            chapter: readableChapters[pageChapter.index - 1],
            availableChapters: readableChapters,
            localRealm,
            source,
            offsetIndex: indexOffset,
          });
        }
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
        /**
         * User should decide to fetch on transition page
         * But for better UX, fetch the next chapter immediately...
         * In the case the next chapter is not fetched, however, this will run when the user reaches this
         */
        if (
          chapterRef.current.numberOfPages != null &&
          chapterRef.current.index - 1 === item.next.index
        ) {
          setCurrentPage(chapterRef.current.numberOfPages);
          const p = localRealm.objectForPrimaryKey(
            ChapterSchema,
            item.next._id,
          );
          if (
            p != null &&
            !chapterInfo.current[item.next._id]?.alreadyFetched &&
            !chapterInfo.current[item.next._id]?.loading
          ) {
            console.log('Fetching next chapter...');
            await fetchPagesByChapter({
              chapter: p,
              availableChapters: readableChapters,
              localRealm,
              source,
              offsetIndex: indexOffset,
            });
          }
        } else if (chapterRef.current.index + 1 === item.previous.index) {
          setCurrentPage(1);
          // asynchronous fetch previous chapter here
          const p = localRealm.objectForPrimaryKey(
            ChapterSchema,
            item.previous._id,
          );
          if (
            p != null &&
            !chapterInfo.current[item.previous._id]?.alreadyFetched &&
            !chapterInfo.current[item.previous._id]?.loading
          ) {
            console.log('Fetching previous chapter...');
            await fetchPagesByChapter({
              chapter: p,
              availableChapters: readableChapters,
              localRealm,
              source,
              offsetIndex: indexOffset,
              fetchedPreviousChapter,
            });
          }
        }
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

  // const getItemLayout = React.useCallback(
  //   (data: Page[] | null | undefined, index: number) => {
  //     if (data == null)
  //       return {
  //         index,
  //         offset: (horizontal ? width : height) * index,
  //         length: horizontal ? width : height,
  //       };

  //     switch (readingDirection) {
  //       case ReadingDirection.WEBTOON:
  //         // eslint-disable-next-line no-case-declarations
  //         const page = data[index];
  //         // eslint-disable-next-line no-case-declarations
  //         let offset = 0;
  //         for (let i = 0; i < index; i++) {
  //           const p = data[i];
  //           switch (p.type) {
  //             case 'PAGE':
  //               offset += p.height * (width / p.width);
  //               break;
  //             default:
  //               offset += height;
  //               break;
  //           }
  //         }
  //         return {
  //           index,
  //           offset,
  //           length:
  //             page.type === 'PAGE'
  //               ? page.height * (width / page.width)
  //               : height,
  //         };
  //       case ReadingDirection.LEFT_TO_RIGHT:
  //       case ReadingDirection.RIGHT_TO_LEFT:
  //       default:
  //         return { index, offset: width * index, length: width };
  //       case ReadingDirection.VERTICAL:
  //         return {
  //           index,
  //           offset: height * index,
  //           length: height,
  //         };
  //     }
  //   },
  //   [readingDirection, horizontal, width, height],
  // );

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

  return (
    <ChapterPageContext.Provider
      value={React.useMemo(() => ({ imageMenuRef, tapGesture }), [tapGesture])}
    >
      <TransitionPageContext.Provider
        value={React.useMemo(
          () => ({
            backgroundColor,
            currentChapter: chapter,
            tapGesture,
            showTransitionPage,
          }),
          [backgroundColor, chapterKey, tapGesture, showTransitionPage],
        )}
      >
        <ChapterErrorContext.Provider
          value={React.useMemo(
            () => ({
              availableChapters: readableChapters,
              localRealm,
              offsetIndex: indexOffset,
              source,
            }),
            [readableChapters, localRealm, indexOffset, source],
          )}
        >
          <Overlay
            imageMenuRef={imageMenuRef}
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
              <Box minWidth={width} minHeight={height}>
                <FlashList
                  ref={flatListRef}
                  // FlatList Props
                  // updateCellsBatchingPeriod={100}
                  // getItemLayout={getItemLayout}
                  // windowSize={13}
                  // maxToRenderPerBatch={50}
                  // contentContainerStyle={contentContainerStyle}

                  // FlashList props
                  estimatedFirstItemOffset={
                    !isOnFirstChapter ? (horizontal ? width : height) : 0
                  }
                  initialScrollIndex={_chapter.indexPage}
                  drawDistance={horizontal ? width : height}
                  estimatedItemSize={horizontal ? width : height}
                  getItemType={getItemType}
                  overrideItemLayout={overrideItemLayout}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleOnScroll}
                  viewabilityConfigCallbackPairs={
                    viewabilityConfigCallbackPairs.current
                  }
                  horizontal={horizontal}
                  data={pages}
                  inverted={reversed}
                  renderItem={renderItem}
                  keyExtractor={keyExtractor}
                  pagingEnabled={pagingEnabled}
                />
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

const renderItem: ListRenderItem<Page> = ({ item, index }) => {
  switch (item.type) {
    case 'PAGE':
      return <ChapterPage page={item} index={index} />;
    case 'TRANSITION_PAGE':
      return <TransitionPage page={item} />;
    case 'NO_MORE_PAGES':
      return <NoMorePages />;
    case 'CHAPTER_ERROR':
      return <ChapterError error={item} />;
  }
};

export default connector(Reader);
