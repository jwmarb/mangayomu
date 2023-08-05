import Box from '@components/Box';
import Progress from '@components/Progress';
import { Page } from '@redux/slices/reader/reader';
import { ReadingDirection } from '@redux/slices/settings';
import Overlay from '@screens/Reader/components/Overlay';
import React from 'react';
import {
  Gesture,
  GestureDetector,
  GestureType,
} from 'react-native-gesture-handler';
import connector, { ConnectedReaderProps } from './Reader.redux';
import useScreenDimensions from '@hooks/useScreenDimensions';
import useReaderProps from '@screens/Reader/hooks/useReaderProps';
import useData from '@screens/Reader/hooks/useData';
import useChapterFetcher from '@screens/Reader/hooks/useChapterFetcher';
import { FlashList } from '@shopify/flash-list';
import { TransitionPageContext } from '@screens/Reader/components/TransitionPage/TransitionPage';
import { ChapterErrorContext } from '@screens/Reader/components/ChapterError/ChapterError';
import usePageLayout from '@screens/Reader/hooks/usePageLayout';
import useSavedChapterInfo from '@screens/Reader/hooks/useSavedChapterInfo';
import { PageSliderNavigatorMethods } from '@screens/Reader/components/Overlay/components/PageSliderNavigator/PageSliderNavigator.interfaces';
import useMutableObject from '@hooks/useMutableObject';
import NetworkToast from '@screens/Reader/components/NetworkToast';
import useOverlayGesture from '@screens/Reader/hooks/useOverlayGesture';
import useNetworkToast from '@screens/Reader/hooks/useNetworkToast';
import useFlashList from '@screens/Reader/hooks/useFlashList';
import useCancellable from '@screens/Reader/hooks/useCancellable';
import PageList from '@screens/Reader/components/PageList';
import displayMessage from '@helpers/displayMessage';
import { ChapterPageContext } from '@screens/Reader/components/ChapterPage/context/ChapterPageContext';
import { ImageMenuMethods } from '@screens/Reader/components/ImageMenu';
import useViewableItemsChangedHandler from '@screens/Reader/hooks/useViewableItemsChangedHandler';
import useSharedValuePageState from '@screens/Reader/hooks/useSharedValuePageState';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
import useAppSelector from '@hooks/useAppSelector';

const Reader: React.FC<RootStackProps<'Reader'>> = (props) => {
  // const {
  //   chapter: chapterKey,
  //   incognito,
  //   pages,
  //   backgroundColor,
  //   manga: mangaKey,
  //   extendedState,
  //   notifyOnLastChapter,
  //   autoFetch,
  // } = props;
  const {
    route: {
      params: { manga: mangaKey },
    },
  } = props;
  const chapterKey = useAppSelector(
    (state) => state.reader.currentChapter ?? props.route.params.chapter,
  );
  const notifyOnLastChapter = useAppSelector(
    (state) => state.settings.reader.notifyOnLastChapter,
  );
  const pages = useAppSelector((state) => state.reader.pages);
  const backgroundColor = useAppSelector(
    (state) => state.settings.reader.backgroundColor,
  );
  const extendedState = useAppSelector((state) => state.reader.extendedState);
  const { width, height } = useScreenDimensions();
  const ref = React.useRef<FlashList<Page>>(null);
  const [manga, chapter, availableChapters, chapterWithData] = useData(
    mangaKey,
    chapterKey,
  );
  React.useEffect(() => {
    if (notifyOnLastChapter && availableChapters[0]._id === chapter._id)
      displayMessage('Final chapter');
  }, [notifyOnLastChapter, chapter._id]);

  const pageSliderNavRef = React.useRef<PageSliderNavigatorMethods>(null);
  const imageMenuRef = React.useRef<ImageMenuMethods>(null);
  const [currentPage, setCurrentPage] = React.useState<number>(
    chapterWithData.indexPage + 1,
  );
  const currentPageKey = React.useRef<string>('');
  const [cancellable, isFetchingPrevious] = useCancellable();
  const fetchPagesByChapter = useChapterFetcher({
    availableChapters,
    manga,
    chapter,
    chapterWithData,
    currentPage,
    cancellable,
  });
  const readerProps = useReaderProps(manga);
  const { readingDirection, imageScaling, zoomStartPosition } = readerProps;
  const panRef = React.useRef<GestureType>();
  const pinchRef = React.useRef<GestureType>();
  const {
    tapGesture,
    showOverlay,
    overlayOpacity,
    panGesture,
    velocityX,
    pinchGesture,
    pageGestures,
    doubleTapGesture,
    velocityY,
  } = useOverlayGesture({
    panRef,
    pageKey: currentPageKey,
    pinchRef,
    readingDirection,
  });
  const viewabilityConfigCallbackPairs = useViewableItemsChangedHandler({
    manga,
    chapter,
    fetchPagesByChapter,
    pageSliderNavRef,
    showOverlay,
    setCurrentPage,
    cancellable,
    currentPageKey,
  });
  const { topOverlayStyle, toastStyle } = useNetworkToast({
    overlayOpacity,
  });

  const animatedPreviousState = useSharedValuePageState(
    imageScaling,
    zoomStartPosition,
  );

  const {
    getPageOffset,
    getSafeScrollRange,
    estimatedItemSize,
    getItemLayout,
  } = usePageLayout({
    readingDirection,
    chapterKey,
  });

  const { getItemType, overrideItemLayout, keyExtractor, renderItem } =
    useFlashList({ getPageOffset });

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
    savedChapterInfo: chapterWithData,
    scrollRef: ref,
    manga,
  });

  const transitionPageContextValue = React.useMemo(
    () => ({ currentChapter: chapter, tapGesture }),
    [tapGesture, chapter._id],
  );

  const composedGestures = React.useMemo(
    () =>
      Gesture.Simultaneous(
        panGesture,
        Gesture.Race(
          pinchGesture,
          Gesture.Exclusive(doubleTapGesture, tapGesture),
        ),
      ),
    [panGesture, tapGesture, pinchGesture, doubleTapGesture],
  );

  const extraData = { extendedState, readingDirection, chapter };

  return (
    <ChapterErrorContext.Provider value={fetchPagesByChapter}>
      <ChapterPageContext.Provider
        value={{
          animatedPreviousState,
          mangaTitle: manga.title,
          readingDirection,
          sourceName: manga.source,
          imageMenuRef,
          velocityX,
          rootPanGesture: panGesture,
          pageGestures,
          rootPinchGesture: pinchGesture,
          velocityY,
          imageScaling,
          zoomStartPosition,
        }}
      >
        <TransitionPageContext.Provider value={transitionPageContextValue}>
          <Overlay
            imageMenuRef={imageMenuRef}
            topOverlayStyle={topOverlayStyle}
            isFinishedInitialScrollOffset={isFinishedInitialScrollOffset}
            pageSliderNavRef={pageSliderNavRef}
            scrollRef={ref}
            readerProps={readerProps}
            currentPage={currentPage}
            manga={manga}
            chapter={chapter}
            savedChapterInfo={chapterWithData}
            opacity={overlayOpacity}
          />
          <NetworkToast style={toastStyle} />
          <GestureDetector gesture={composedGestures}>
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
                  key={width}
                  currentPageKey={currentPageKey}
                  pinchRef={pinchRef}
                  pageGestures={pageGestures}
                  panRef={panRef}
                  ref={ref}
                  readingDirection={readingDirection}
                  getItemLayout={getItemLayout}
                  maxToRenderPerBatch={10}
                  windowSize={9}
                  updateCellsBatchingPeriod={0}
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
                  initialScrollIndex={chapterWithData.indexPage}
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
