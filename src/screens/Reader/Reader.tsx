import Button from '@components/Button';
import Flex from '@components/Flex';
import { RootStackParamList } from '@navigators/Root/Root.interfaces';
import { StackScreenProps } from '@react-navigation/stack';
import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { keyExtractor } from '@screens/Reader/Reader.flatlist';
import Page from '@screens/Reader/components/Page';
import TransitioningPage from '@screens/Reader/components/TransitioningPage';
import {
  Dimensions,
  ListRenderItem,
  useWindowDimensions,
  View,
  FlatList,
  ViewabilityConfigCallbackPairs,
  ViewToken,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
} from 'react-native';
import connector, { ConnectedReaderProps } from '@screens/Reader/Reader.redux';
import React from 'react';
import {
  FlingGestureHandler,
  Gesture,
  GestureDetector,
  NativeViewGestureHandler,
  PanGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { MangaPage, Page as IPage, TransitionPage } from '@redux/reducers/readerReducer/readerReducer.interfaces';
import { ReaderDirection } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import NoMoreChapters from '@screens/Reader/components/NoMoreChapters';
import { Typography } from '@components/Typography';
import Screen from '@components/Screen';
import { ReaderGestureContainer, ReaderGestureScreenFiller, ReaderWrapper } from '@screens/Reader/Reader.base';
import Spacer from '@components/Spacer';
import { MangaChapter } from '@services/scraper/scraper.interfaces';
import Progress from '@components/Progress';
import Animated, {
  FadeIn,
  FadeOut,
  FadeOutDown,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import Overlay from '@screens/Reader/components/Overlay';
import displayMessage from '@utils/displayMessage';
import { createEventHandler } from '@screens/Reader/components/Page/Page.helpers';
import { PagePanGestureContext, PagePinchGestureContext } from '@screens/Reader/components/Page/Page.interfaces';
import useMountedEffect from '@hooks/useMountedEffect';
import { Modal } from '@components/core';
import ReaderModal from '@screens/Reader/components/ReaderModal';
import ReaderSettingsModal from '@screens/Reader/components/ReaderSettingsModal';
import { ReaderScreenOrientation } from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.constants';
import * as Orientation from 'expo-screen-orientation';
import DownloadManager from '@utils/DownloadManager';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';

const Reader: React.FC<ConnectedReaderProps> = (props) => {
  const {
    backgroundColor,
    source,
    chapter,
    exitReader,
    transformPages,
    manga,
    openReader,
    data,
    readerDirection,
    setReaderError,
    setReaderIndex,
    error,
    setReaderLoading,
    loadingContent,
    maintainScrollPositionOffset,
    setCurrentlyReadingChapter,
    initialScrollIndex,
    maintainScrollIndex,
    transitioningPageShouldFetch,
    index,
    readerOrientation,
    deviceOrientation,
    showOverlay,
    showModal,
    openReaderModal,
    closeReaderModal,
    shouldTrackIndex,
    keepScreenAwake,
  } = props;

  const { width, height } = useWindowDimensions();
  const scrollPositionRef = React.useRef<number>(0);
  const isMounted = React.useRef<boolean>(false);

  const handleOnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    switch (readerDirection) {
      case ReaderDirection.LEFT_TO_RIGHT:
      case ReaderDirection.RIGHT_TO_LEFT:
        scrollPositionRef.current = event.nativeEvent.contentOffset.x;
        break;
      case ReaderDirection.VERTICAL:
      case ReaderDirection.WEBTOON:
        scrollPositionRef.current = event.nativeEvent.contentOffset.y;
        break;
    }
  };

  React.useEffect(() => {
    if (keepScreenAwake) activateKeepAwake();
    else deactivateKeepAwake();
    return () => {
      deactivateKeepAwake();
    };
  }, [keepScreenAwake]);

  React.useLayoutEffect(() => {
    switch (readerOrientation) {
      case ReaderScreenOrientation.LANDSCAPE:
        Orientation.lockAsync(Orientation.OrientationLock.LANDSCAPE);
        break;
      case ReaderScreenOrientation.PORTRAIT:
        Orientation.lockAsync(Orientation.OrientationLock.PORTRAIT);
        break;
      default:
        Orientation.unlockAsync();
    }
    return () => {
      Orientation.unlockAsync();
    };
  }, [readerOrientation]);

  React.useEffect(() => {
    if (isMounted.current) {
      shouldTrackIndex(false);
      let interval: NodeJS.Timer | undefined;
      flatListRef.current?.scrollToIndex({ animated: true, index });

      new Promise<void>((res) => {
        const interval = setInterval(() => {
          flatListRef.current?.scrollToIndex({ animated: true, index });
        }, 100);
        setTimeout(() => {
          clearInterval(interval);
          res();
        }, 500);
      }).finally(() => {
        clearInterval(interval);
        // if (readerDirection === ReaderDirection.WEBTOON) {
        //   const item = data[index];
        //   flatListRef.current?.scrollToOffset({
        //     animated: false,
        //     offset:
        //       scrollPositionRef.current -
        //       height / 2 +
        //       (item.type === 'PAGE' ? item.height * (width / item.width) * 0.5 : height / 2),
        //   });
        // }
        shouldTrackIndex(true);
      });

      return () => {
        clearInterval(interval);
      };
    } else isMounted.current = true;
  }, [readerDirection]);

  React.useLayoutEffect(() => {
    // const savedIndex = index;
    // flatListRef.current?.scrollToIndex({ animated: false, index });
    // const p = setInterval(() => {
    //   if (savedIndex !== index) flatListRef.current?.scrollToIndex({ animated: false, index: savedIndex });
    //   else clearInterval(p);
    // }, 1);
    // return () => {
    //   clearInterval(p);
    // };
    let interval: NodeJS.Timer | undefined;
    const orientationListener = Orientation.addOrientationChangeListener((orientation) => {
      const { width, height } = Dimensions.get('window');

      shouldTrackIndex(false);
      new Promise<void>((res) => {
        switch (readerDirection) {
          case ReaderDirection.LEFT_TO_RIGHT:
          case ReaderDirection.RIGHT_TO_LEFT:
            const indexAtOldOrientation = Math.round(scrollPositionRef.current / height);
            interval = setInterval(() => {
              flatListRef.current?.scrollToIndex({ animated: true, index: indexAtOldOrientation });
            }, 100);

            setTimeout(() => {
              clearInterval(interval);
              res();
            }, 200);
            break;
          case ReaderDirection.WEBTOON:
          case ReaderDirection.VERTICAL:
            interval = setInterval(() => {
              flatListRef.current?.scrollToIndex({
                animated: true,
                index,
              });
            }, 100);

            setTimeout(() => {
              clearInterval(interval);
              res();
            }, 200);

            break;
        }
      }).finally(() => {
        shouldTrackIndex(true);
      });
    });
    return () => {
      orientationListener.remove();
      clearInterval(interval);
    };
  }, []);

  React.useLayoutEffect(() => {
    if (maintainScrollPositionOffset != null && maintainScrollIndex >= 0) {
      const maintained = scrollPositionRef.current + maintainScrollPositionOffset[readerDirection];
      // const saved = maintainScrollIndex;
      // setTimeout(
      //   () =>
      //     flatListRef.current?.scrollToIndex({
      //       animated: false,
      //       index: saved,
      //     }),
      //   0
      // );

      // setTimeout(
      //   () =>
      //     flatListRef.current?.scrollToIndex({
      //       animated: true,
      //       index: maintainScrollIndex,
      //     }),
      //   1000
      // );
      shouldTrackIndex(false);
      let p: NodeJS.Timer | undefined;

      new Promise<void>((res) => {
        p = setInterval(() => {
          if (Math.round(scrollPositionRef.current) !== Math.round(maintained)) {
            flatListRef.current?.scrollToOffset({
              animated: false,
              offset: maintained,
            });
          } else {
            res();
            clearInterval(p);
          }
        }, 1);
      }).finally(() => {
        shouldTrackIndex(true);
      });
      return () => {
        clearInterval(p);
      };
      // setTimeout(() => setReaderIndex(), 0);
    }
  }, [maintainScrollPositionOffset]);

  const flatListRef = React.useRef<FlatList>(null);
  // React.useEffect(() => {
  //   console.log(`${data}`);
  // }, [data]);

  const fetchChapter = React.useCallback(
    async (
      pagesToFetchFrom: ReadingChapterInfo,
      extendedStateKey?: string,
      appendLocation: 'start' | 'end' | null = null
    ) => {
      const downloadManager = DownloadManager.ofWithManga(pagesToFetchFrom, manga);
      setReaderLoading(true, extendedStateKey);
      const uris = await downloadManager.getDownloadedURIs();
      if (uris.length === 0 || uris.some((uri) => !uri.exists))
        try {
          const pages = await source.getPages(pagesToFetchFrom);
          await transformPages(pages, pagesToFetchFrom, manga, appendLocation);
        } catch (e) {
          setReaderError(e);
        } finally {
          setReaderLoading(false, extendedStateKey);
        }
      else {
        try {
          await transformPages(
            uris.map((x) => x.uri),
            pagesToFetchFrom,
            manga,
            appendLocation
          );
        } catch (e) {
          setReaderError(e);
        } finally {
          setReaderLoading(false, extendedStateKey);
        }
      }
    },
    [manga]
  );

  React.useEffect(() => {
    openReader(manga, chapter);
    displayMessage(readerDirection);
    return () => {
      exitReader();
    };
  }, []);
  React.useEffect(() => {
    fetchChapter(chapter);
  }, []);

  const renderItem: ListRenderItem<MangaPage> = React.useCallback(
    ({ item }) => {
      switch (item.type) {
        case 'PAGE':
          return (
            <Page
              uri={item.link}
              width={item.width}
              height={item.height}
              manga={manga}
              isFirstPage={item.isFirstPage}
              isLastPage={item.isLastPage}
              chapter={item.chapter}
              isOfFirstChapter={item.isOfFirstChapter}
            />
          );
        case 'CHAPTER_TRANSITION':
          return (
            <TransitioningPage
              fetchChapter={fetchChapter}
              manga={manga}
              previous={item.previous}
              next={item.next}
              extendedStateKey={item.extendedStateKey}
            />
          );
        case 'NO_MORE_CHAPTERS':
          return <NoMoreChapters />;
        default:
          return null;
      }
    },
    [manga]
  );

  const handleOnViewableItemsChanged: (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => void =
    React.useCallback(({ viewableItems, changed }) => {
      if (viewableItems.length > 0) {
        const [_page] = viewableItems.slice(-1);
        if (_page.index != null && (_page.item as MangaPage).type === 'PAGE') setReaderIndex(_page.index);
        switch ((_page.item as MangaPage).type) {
          case 'PAGE': {
            const page = _page as Omit<ViewToken, 'item'> & { item: IPage };
            if ((!page.item.isOfFirstChapter && page.item.isFirstPage != null) || page.item.isLastPage != null) {
              setCurrentlyReadingChapter(page.item.chapter);
            }
            break;
          }
          case 'CHAPTER_TRANSITION': {
            const { extendedStateKey } = _page.item as TransitionPage;
            transitioningPageShouldFetch(extendedStateKey);
            break;
          }
          case 'NO_MORE_CHAPTERS':
            showOverlay();
            break;
        }
      }
    }, []);

  const viewabilityConfigCallbackPairs = React.useRef<ViewabilityConfigCallbackPairs>([
    {
      onViewableItemsChanged: handleOnViewableItemsChanged,
      viewabilityConfig: { viewAreaCoveragePercentThreshold: 99, waitForInteraction: false },
    },
  ]);

  const getItemLayout: (
    data: MangaPage[] | null | undefined,
    index: number
  ) => {
    length: number;
    offset: number;
    index: number;
  } = React.useCallback(
    (data, index) => {
      switch (readerDirection) {
        case ReaderDirection.LEFT_TO_RIGHT:
        case ReaderDirection.RIGHT_TO_LEFT:
          return { length: width, offset: width * index, index };
        case ReaderDirection.VERTICAL:
          return { length: height, offset: height * index, index };
        case ReaderDirection.WEBTOON: {
          if (!data)
            return {
              length: height,
              offset: height * index,
              index,
            };
          if (data[index] == null) {
            return {
              length: height,
              offset: height * index,
              index,
            };
          }

          let offset = 0;
          for (let i = 0; i < index; i++) {
            switch (data[i].type) {
              case 'PAGE':
                const maxScale = width / (data[i] as IPage).width; // see Page.tsx
                offset += (data[i] as IPage).height * maxScale;
                break;
              case 'NO_MORE_CHAPTERS':
              case 'CHAPTER_TRANSITION':
                offset += height;
                break;
              default:
                throw Error(`Found invalid item type in getItemLayout. The type was ${data[i].type}`);
            }
          }

          switch (data[index].type) {
            case 'PAGE':
              const maxScale = width / (data[index] as IPage).width;
              return {
                length: (data[index] as IPage).height * maxScale,
                offset,
                index,
              };
            case 'CHAPTER_TRANSITION':
            case 'NO_MORE_CHAPTERS':
              return {
                length: height,
                offset,
                index,
              };
            default:
              throw Error(`Found invalid item type in getItemLayout. The type was ${data[index].type}`);
          }
          // if (index === 0) {
          //   switch (data[0].type) {
          //     case 'CHAPTER_TRANSITION':
          //     case 'NO_MORE_CHAPTERS':
          //       memoized[0] = height / 2;
          //       return { length: height / 2, offset: 0, index: 0 };
          //     case 'PAGE':
          //       memoized[0] = data[0].height;
          //       return { length: data[0].height, offset: 0, index: 0 };
          //     default:
          //       throw Error('Invalid item types in getItemLayout method.');
          //   }
          // } else {
          //   const previouslyCalculatedHeight = memoized[index - 1];
          //   const obj = data[index];
          //   switch (obj.type) {
          //     case 'CHAPTER_TRANSITION':
          //     case 'NO_MORE_CHAPTERS':
          //       memoized[index] = previouslyCalculatedHeight + height / 2;
          //       return { length: height / 2, offset: memoized[index], index };
          //     case 'PAGE':
          //       memoized[index] = previouslyCalculatedHeight + obj.height;
          //       return { length: obj.height, offset: memoized[index], index };
          //     default:
          //       throw Error('Invalid item types in getItemLayout method.');
          //   }
          // }
        }
      }
    },
    [readerDirection, width, height]
  );

  if (loadingContent)
    return (
      <Animated.View entering={FadeIn} exiting={FadeOutDown}>
        <ReaderWrapper>
          <Flex alignItems='center' grow justifyContent='center'>
            <Progress />
          </Flex>
        </ReaderWrapper>
      </Animated.View>
    );

  if (error)
    return (
      <ReaderWrapper>
        <Typography align='center'>There was an error loading this chapter</Typography>
        <Spacer y={1} />
        <Flex justifyContent='center'>
          <Button title='Retry' onPress={() => fetchChapter(chapter)} />
        </Flex>
      </ReaderWrapper>
    );

  return (
    <>
      <ReaderSettingsModal />
      <ReaderModal manga={manga} />
      <FlatList
        scrollEnabled={maintainScrollIndex !== -1}
        ref={flatListRef}
        initialScrollIndex={initialScrollIndex !== -1 ? initialScrollIndex : undefined}
        getItemLayout={getItemLayout}
        windowSize={7}
        maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
        pagingEnabled={readerDirection !== ReaderDirection.WEBTOON}
        maxToRenderPerBatch={1}
        updateCellsBatchingPeriod={10}
        onScroll={handleOnScroll}
        contentContainerStyle={{
          backgroundColor: backgroundColor.toLowerCase(),
          minHeight: '100%',
        }}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal={
          readerDirection === ReaderDirection.RIGHT_TO_LEFT || readerDirection === ReaderDirection.LEFT_TO_RIGHT
        }
        inverted={readerDirection === ReaderDirection.RIGHT_TO_LEFT}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        scrollEventThrottle={100}
      />
      <Overlay manga={manga} flatListRef={flatListRef} />
    </>
  );
};

export default connector(Reader);
