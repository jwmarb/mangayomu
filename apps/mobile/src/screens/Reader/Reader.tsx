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
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
  ViewabilityConfigCallbackPairs,
  ViewToken,
  FlatList,
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
    notifyOnLastChapter,
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
  } = initializeReaderRefs({ _chapter, _chapterInfo, pages });

  const transitionPageOpacity = useSharedValue(0);
  const transitionPageStyle = useAnimatedStyle(
    () => ({
      opacity: transitionPageOpacity.value,
    }),
    [],
  );
  React.useEffect(() => {
    chapterInfo.current = _chapterInfo;
  }, [_chapterInfo]);
  chapterKeyEffect({
    chapterKey,
    localRealm,
    setChapter,
    chapterRef,
    indexOffset,
    getOffset,
    scrollPositionLandscape,
    scrollPositionPortrait,
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
  });
  const [shouldTrackScrollPosition, _setShouldTrackScrollPosition] =
    React.useState<boolean>(false);
  function setShouldTrackScrollPosition(value: boolean) {
    if (value) transitionPageOpacity.value = 1;
    else transitionPageOpacity.value = 0;
    _setShouldTrackScrollPosition(value);
    shouldTrackScrollPositionRef.current = value;
  }

  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const reversed = React.useMemo(
    () =>
      manga.readerDirection === 'Use global setting'
        ? globalReversed
        : manga.readerDirection === ReadingDirection.RIGHT_TO_LEFT,
    [manga.readerDirection, globalReversed],
  );
  const lockOrientation = React.useMemo(
    () =>
      manga.readerLockOrientation === 'Use global setting'
        ? globalDeviceOrientation
        : manga.readerLockOrientation,
    [globalDeviceOrientation, manga.readerLockOrientation],
  );
  const horizontal = React.useMemo(
    () =>
      manga.readerDirection === 'Use global setting'
        ? globalHorizontal
        : manga.readerDirection === ReadingDirection.RIGHT_TO_LEFT ||
          manga.readerDirection === ReadingDirection.LEFT_TO_RIGHT,
    [manga.readerDirection, globalHorizontal],
  );
  const pagingEnabled = React.useMemo(
    () =>
      manga.readerDirection === 'Use global setting'
        ? globalPagingEnabled
        : manga.readerDirection !== ReadingDirection.WEBTOON,
    [manga.readerDirection, globalPagingEnabled],
  );
  const readingDirection = React.useMemo(
    () =>
      manga.readerDirection === 'Use global setting'
        ? globalReadingDirection
        : manga.readerDirection,
    [manga.readerDirection, globalReadingDirection],
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
    setShouldTrackScrollPosition(false);
    const interval = setInterval(() => {
      flatListRef.current?.scrollToOffset({ offset, animated: false });
      if (
        width > height &&
        15 >= Math.abs(scrollPositionLandscapeUnsafe.current - offset)
      ) {
        setShouldTrackScrollPosition(true);
        clearInterval(interval);
      } else if (
        15 >= Math.abs(scrollPositionPortraitUnsafe.current - offset)
      ) {
        setShouldTrackScrollPosition(true);
        clearInterval(interval);
      }
    });
    return interval;
  }

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
  });

  readerScrollPositionInitialHandler({
    forceScrollToOffset,
    shouldTrackScrollPosition,
    _chapter,
    readableChapters,
    horizontal,
    scrollPositionLandscape,
    scrollPositionPortrait,
    transitionPageOpacity,
    indexOffset,
    getOffset,
    localRealm,
    readingDirection,
    chapterRef,
    realm,
    manga,
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
            await fetchPagesByChapter({
              chapter: p,
              availableChapters: readableChapters,
              localRealm,
              source,
              offsetIndex: indexOffset,
            });
            console.log(`fetching next chapter: ${p._id}`);
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
            console.log(`fetching previous chapter: ${p._id}`);
            await fetchPagesByChapter({
              chapter: p,
              availableChapters: readableChapters,
              localRealm,
              source,
              offsetIndex: indexOffset,
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

  return (
    <ChapterPageContext.Provider value={{ imageMenuRef, tapGesture }}>
      <TransitionPageContext.Provider
        value={{
          availableChapters: readableChapters,
          backgroundColor,
          currentChapter: chapter,
          offsetIndex: indexOffset,
          source,
          tapGesture,
          transitionPageStyle,
        }}
      >
        <GestureDetector gesture={tapGesture}>
          <FlatList
            ref={flatListRef}
            ListHeaderComponent={
              <Overlay
                imageMenuRef={imageMenuRef}
                currentPage={currentPage}
                manga={manga}
                chapter={chapter}
                opacity={overlayOpacity}
                mangaTitle={manga.title}
              />
            }
            ListEmptyComponent={
              <Box flex-grow align-items="center" justify-content="center">
                <Progress />
              </Box>
            }
            updateCellsBatchingPeriod={10}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            getItemLayout={getItemLayout}
            onScroll={handleOnScroll}
            windowSize={7}
            viewabilityConfigCallbackPairs={
              viewabilityConfigCallbackPairs.current
            }
            maxToRenderPerBatch={50}
            horizontal={horizontal}
            data={pages}
            inverted={reversed}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            pagingEnabled={pagingEnabled}
            contentContainerStyle={contentContainerStyle}
          />
        </GestureDetector>
      </TransitionPageContext.Provider>
    </ChapterPageContext.Provider>
  );
};

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

const renderItem: ListRenderItem<Page> = ({ item }) => {
  switch (item.type) {
    case 'PAGE':
      return <ChapterPage page={item} />;
    case 'TRANSITION_PAGE':
      return <TransitionPage page={item} />;
    case 'NO_MORE_PAGES':
      return <NoMorePages />;
    default:
      return null;
  }
};

export default connector(Reader);
