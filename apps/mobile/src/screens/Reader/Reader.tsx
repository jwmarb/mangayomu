import Box from '@components/Box';
import Progress from '@components/Progress';
import { useLocalRealm, useRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { Page } from '@redux/slices/reader/reader';
import { useNetInfo } from '@react-native-community/netinfo';
import { ReadingDirection } from '@redux/slices/settings';
import Overlay from '@screens/Reader/components/Overlay';
import React from 'react';
import { GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import connector, { ConnectedReaderProps } from './Reader.redux';
import useScreenDimensions from '@hooks/useScreenDimensions';
import useReaderProps from '@screens/Reader/hooks/useReaderProps';
import useData from '@screens/Reader/hooks/useData';
import useChapterFetcher from '@screens/Reader/hooks/useChapterFetcher';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import TransitionPage, {
  TransitionPageContext,
} from '@screens/Reader/components/TransitionPage/TransitionPage';
import ChapterPage, {
  ChapterPageContext,
} from '@screens/Reader/components/ChapterPage/ChapterPage';
import { ViewToken, ViewabilityConfigCallbackPairs } from 'react-native';
import NoMorePages from '@screens/Reader/components/NoMorePages/NoMorePages';
import ChapterError, {
  ChapterErrorContext,
} from '@screens/Reader/components/ChapterError/ChapterError';
import useUserHistory from '@hooks/useUserHistory';
import usePageLayout from '@screens/Reader/hooks/usePageLayout';
import useSavedChapterInfo from '@screens/Reader/hooks/useSavedChapterInfo';
import { PageSliderNavigatorMethods } from '@screens/Reader/components/Overlay/components/PageSliderNavigator/PageSliderNavigator.interfaces';
import useMutableObject from '@hooks/useMutableObject';
import NetworkToast from '@screens/Reader/components/NetworkToast';
import useOverlayGesture from '@screens/Reader/hooks/useOverlayGesture';
import useNetworkToast from '@screens/Reader/hooks/useNetworkToast';

const Reader: React.FC<ConnectedReaderProps> = (props) => {
  const {
    chapter: chapterKey,
    incognito,
    pages,
    backgroundColor,
    manga: mangaKey,
    globalReadingDirection,
    globalDeviceOrientation,
    globalImageScaling,
    globalZoomStartPosition,
    extendedState,
    setCurrentChapter,
    resetReaderState,
  } = props;
  const { width, height } = useScreenDimensions();
  const overlayOpacity = useSharedValue(0);
  const realm = useRealm();
  const localRealm = useLocalRealm();
  const ref = React.useRef<FlashList<Page>>(null);
  const { addMangaToHistory } = useUserHistory({ incognito });
  const [manga, chapter, availableChapters] = useData(mangaKey, chapterKey);
  const pageSliderNavRef = React.useRef<PageSliderNavigatorMethods>(null);
  const fetchPagesByChapter = useChapterFetcher({ availableChapters, manga });
  const netInfo = useNetInfo();
  const tapGesture = useOverlayGesture({ overlayOpacity });
  const { topOverlayStyle, toastStyle } = useNetworkToast({
    overlayOpacity,
    internetStatus,
  });
  const readerProps = useReaderProps(manga, {
    readingDirection: globalReadingDirection,
    lockOrientation: globalDeviceOrientation,
    imageScaling: globalImageScaling,
    zoomStartPosition: globalZoomStartPosition,
  });
  const { readingDirection } = readerProps;
  const { getPageOffset, getSafeScrollRange, estimatedItemSize } =
    usePageLayout({
      readingDirection,
      pages,
      chapterKey,
    });

  const reversed = useMutableObject(
    readingDirection === ReadingDirection.RIGHT_TO_LEFT,
  );

  const horizontal =
    readingDirection === ReadingDirection.RIGHT_TO_LEFT ||
    readingDirection === ReadingDirection.LEFT_TO_RIGHT;
  const pagingEnabled = readingDirection !== ReadingDirection.WEBTOON;
  const isOnFirstChapter =
    availableChapters[availableChapters.length - 1].index === chapter.index;

  const { onScroll, isFinishedInitialScrollOffset } = useSavedChapterInfo({
    getSafeScrollRange,
    horizontal,
    chapter,
    scrollRef: ref,
    pages,
  });
  const [currentPage, setCurrentPage] = React.useState<number>(
    chapter.indexPage + 1,
  );
  const handleOnViewableItemsChanged = (info: {
    viewableItems: ViewToken[];
    changed: ViewToken[];
  }) => {
    const page = info.viewableItems[0];
    if (page != null) {
      const item = page.item as Page;

      if (item.type === 'PAGE') {
        const chapter = localRealm.objectForPrimaryKey(
          ChapterSchema,
          item.chapter,
        );
        realm.write(() => {
          if (chapter?.numberOfPages != null)
            manga.currentlyReadingChapter = {
              _id: item.chapter,
              index: item.pageNumber - 1,
              numOfPages: chapter.numberOfPages,
            };
        });
        localRealm.write(() => {
          if (chapter != null) chapter.indexPage = item.pageNumber - 1;
        });
        setCurrentPage(item.pageNumber);
        setCurrentChapter(item.chapter);
        // pageSliderNavRef.current?.snapPointTo(reversed ? chapterIndices.get() (item.pageNumber - 1));

        if (reversed && chapter?.numberOfPages != null) {
          pageSliderNavRef.current?.snapPointTo(
            chapter.numberOfPages - item.pageNumber,
          );
        } else pageSliderNavRef.current?.snapPointTo(item.pageNumber - 1);
      }
    }
  };

  const overrideItemLayout: (
    layout: {
      span?: number | undefined;
      size?: number | undefined;
    },
    item: Page,
    index: number,
    maxColumns: number,
    extraData?: any,
  ) => void = (layout, item) => {
    layout.size = getPageOffset(item);
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

  React.useEffect(() => {
    const p = fetchPagesByChapter(chapter);
    return () => {
      p?.abort();
      resetReaderState();
    };
  }, []);
  React.useEffect(() => {
    addMangaToHistory({
      manga: {
        imageCover: manga.imageCover,
        index: manga.index,
        link: manga.link,
        source: manga.source,
        title: manga.title,
      },
      chapter: {
        date: chapter.date,
        index: chapter.index,
        link: chapter.link,
        name: chapter.name,
      },
    });
  }, [chapter]);

  const transitionPageContextValue = React.useMemo(
    () => ({ backgroundColor, currentChapter: chapter, tapGesture }),
    [tapGesture, chapter._id, backgroundColor],
  );

  const chapterPageContextValue = React.useMemo(
    () => ({
      mangaTitle: manga.title,
      readingDirection,
      sourceName: manga.source,
      tapGesture,
    }),
    [tapGesture, manga.source, readingDirection, manga.title],
  );

  return (
    <ChapterErrorContext.Provider value={fetchPagesByChapter}>
      <ChapterPageContext.Provider value={chapterPageContextValue}>
        <TransitionPageContext.Provider value={transitionPageContextValue}>
          <Overlay
            topOverlayStyle={topOverlayStyle}
            isFinishedInitialScrollOffset={isFinishedInitialScrollOffset}
            pageSliderNavRef={pageSliderNavRef}
            scrollRef={ref}
            readerProps={readerProps}
            currentPage={currentPage}
            manga={manga}
            chapter={chapter}
            opacity={overlayOpacity}
          />
          <NetworkToast style={toastStyle} />
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
              <Box
                minWidth={width}
                minHeight={height}
                height="100%"
                background-color={backgroundColor.toLowerCase()}
              >
                <FlashList
                  ref={ref}
                  extraData={{ extendedState, readingDirection }}
                  viewabilityConfigCallbackPairs={
                    viewabilityConfigCallbackPairs.current
                  }
                  data={pages}
                  horizontal={horizontal}
                  pagingEnabled={pagingEnabled}
                  estimatedItemSize={estimatedItemSize}
                  estimatedFirstItemOffset={
                    isOnFirstChapter ? 0 : estimatedItemSize
                  }
                  overrideItemLayout={overrideItemLayout}
                  keyExtractor={keyExtractor}
                  inverted={reversed}
                  initialScrollIndex={chapter.indexPage}
                  renderItem={renderItem}
                  getItemType={getItemType}
                  onScroll={onScroll}
                />
              </Box>
            )}
          </GestureDetector>
        </TransitionPageContext.Provider>
      </ChapterPageContext.Provider>
    </ChapterErrorContext.Provider>
  );
};

const renderItem: ListRenderItem<Page> = ({ item, extraData }) => {
  switch (item.type) {
    case 'PAGE':
      return (
        <ChapterPage page={item} extendedPageState={extraData.extendedState} />
      );
    case 'TRANSITION_PAGE':
      return <TransitionPage page={item} />;
    case 'NO_MORE_PAGES':
      return <NoMorePages />;
    case 'CHAPTER_ERROR':
      return <ChapterError data={item} />;
  }
};

const keyExtractor = (p: Page) => {
  switch (p.type) {
    case 'PAGE':
      return `${p.page}.${p.pageNumber}`;
    case 'TRANSITION_PAGE':
      return `${p.previous._id}${p.next._id}`;
    case 'CHAPTER_ERROR':
      return `error-${p.current._id}`;
    case 'NO_MORE_PAGES':
      return 'no more pages';
  }
};

const getItemType: (
  item: Page,
  index: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraData?: any,
) => string | number | undefined = (item) => item.type;

export default connector(Reader);
