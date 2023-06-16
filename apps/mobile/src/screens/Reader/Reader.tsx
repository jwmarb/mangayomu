import Box from '@components/Box';
import Progress from '@components/Progress';
import { useLocalRealm, useRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { Page, chapterIndices } from '@redux/slices/reader/reader';
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
import useFlashList from '@screens/Reader/hooks/useFlashList';
import useCancellable from '@screens/Reader/hooks/useCancellable';
import useBoolean from '@hooks/useBoolean';
import PageList from '@screens/Reader/components/PageList';

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
  } = props;
  const { width, height } = useScreenDimensions();
  const overlayOpacity = useSharedValue(0);
  const realm = useRealm();
  const localRealm = useLocalRealm();
  const ref = React.useRef<FlashList<Page>>(null);
  const [manga, chapter, availableChapters] = useData(mangaKey, chapterKey);
  const [currentPage, setCurrentPage] = React.useState<number>(
    chapter.indexPage + 1,
  );
  const { addMangaToHistory } = useUserHistory({ incognito });
  const pageSliderNavRef = React.useRef<PageSliderNavigatorMethods>(null);
  const fetchPagesByChapter = useChapterFetcher({
    availableChapters,
    manga,
    chapter,
    pages,
  });
  const tapGesture = useOverlayGesture({ overlayOpacity });
  const { topOverlayStyle, toastStyle } = useNetworkToast({
    overlayOpacity,
  });
  const readerProps = useReaderProps(manga, {
    readingDirection: globalReadingDirection,
    lockOrientation: globalDeviceOrientation,
    imageScaling: globalImageScaling,
    zoomStartPosition: globalZoomStartPosition,
  });
  const { readingDirection } = readerProps;
  const {
    getPageOffset,
    getSafeScrollRange,
    estimatedItemSize,
    getItemLayout,
  } = usePageLayout({
    readingDirection,
    pages,
    chapterKey,
  });

  const { getItemType, overrideItemLayout, keyExtractor, renderItem } =
    useFlashList({ getPageOffset });
  const [cancellable, isFetchingPrevious] = useCancellable(pages);

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

  const handleOnViewableItemsChanged = (info: {
    viewableItems: ViewToken[];
    changed: ViewToken[];
  }) => {
    const page = info.viewableItems[0];
    if (page != null) {
      const item = page.item as Page;

      switch (item.type) {
        case 'PAGE':
          {
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

            pageSliderNavRef.current?.snapPointTo(item.pageNumber - 1);
          }
          break;
        case 'TRANSITION_PAGE':
          cancellable(fetchPagesByChapter, item);
          break;
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

  const extraData = { extendedState, readingDirection, chapter };

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
                <PageList
                  ref={ref}
                  readingDirection={readingDirection}
                  getItemLayout={getItemLayout}
                  maxToRenderPerBatch={10}
                  windowSize={9}
                  updateCellsBatchingPeriod={0}
                  removeClippedSubviews
                  initialNumToRender={0}
                  extraData={extraData}
                  maintainVisibleContentPosition={
                    !isFetchingPrevious ? undefined : { minIndexForVisible: 0 }
                  }
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
                  inverted={reversed.current}
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

export default connector(Reader);
