import Box from '@components/Box';
import Progress from '@components/Progress';
import Text from '@components/Text';
import {
  useLocalObject,
  useLocalRealm,
  useObject,
  useRealm,
} from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaSchema } from '@database/schemas/Manga';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import useMangaSource from '@hooks/useMangaSource';
import useMountedEffect from '@hooks/useMountedEffect';
import { Page } from '@redux/slices/reader/reader';
import { ReadingDirection } from '@redux/slices/settings';
import ChapterPage from '@screens/Reader/components/ChapterPage';
import Overlay from '@screens/Reader/components/Overlay';
import ReaderSettingsMenu from '@screens/Reader/components/ReaderSettingsMenu';
import React from 'react';
import {
  Dimensions,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  useWindowDimensions,
  ViewabilityConfigCallbackPairs,
  ViewToken,
} from 'react-native';
import { Gesture, FlatList } from 'react-native-gesture-handler';
import {
  Easing,
  runOnJS,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ScaledSheet } from 'react-native-size-matters';
import connector, { ConnectedReaderProps } from './Reader.redux';
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

function getSetting<T>(setting: T | 'Use global setting', globalSetting: T) {
  if (setting === 'Use global setting') return globalSetting;
  return setting;
}

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
    loading,
  } = props;
  const realm = useRealm();
  const { width, height } = useWindowDimensions();
  const localRealm = useLocalRealm();
  const manga = useObject(MangaSchema, mangaKey);
  const chapter = useLocalObject(ChapterSchema, chapterKey);
  if (manga == null)
    throw Error(
      'Manga does not exist. This error is thrown because it will not be possible to get next chapters without an existing manga object.',
    );
  if (chapter == null)
    throw Error(
      'Chapter does not exist. This error is thrown because data about the chapter is null. The user should fetch the manga first before reading a chapter.',
    );
  const scrollPositionLandscape = React.useRef<number>(0);
  const scrollPositionPortrait = React.useRef<number>(0);
  const [shouldTrackScrollPosition, setShouldTrackScrollPosition] =
    React.useState<boolean>(false);
  const shouldTrackScrollPositionRef = React.useRef<boolean>(false);
  const flatListRef = React.useRef<FlatList>(null);
  const [currentPage, setCurrentPage] = React.useState<number>(
    chapter.indexPage + 1,
  );
  const reversed =
    manga.readerDirection === 'Use global setting'
      ? globalReversed
      : manga.readerDirection === ReadingDirection.RIGHT_TO_LEFT;
  const horizontal =
    manga.readerDirection === 'Use global setting'
      ? globalHorizontal
      : manga.readerDirection === ReadingDirection.RIGHT_TO_LEFT ||
        manga.readerDirection === ReadingDirection.LEFT_TO_RIGHT;
  const pagingEnabled =
    manga.readerDirection === 'Use global setting'
      ? globalPagingEnabled
      : manga.readerDirection !== ReadingDirection.WEBTOON;
  const source = useMangaSource(manga.source);
  const contentContainerStyle = React.useMemo(
    () => [
      styles.container,
      { backgroundColor: backgroundColor.toLowerCase() },
    ],
    [styles.container, backgroundColor],
  );
  const overlayOpacity = useSharedValue(0);
  const [active, setActive] = React.useState<boolean>(false);

  const tapGesture = React.useMemo(
    () =>
      Gesture.Tap()
        .onStart(() => {
          if (overlayOpacity.value > 0) {
            overlayOpacity.value = withTiming(0, {
              duration: 150,
              easing: Easing.ease,
            });
            runOnJS(setActive)(false);
          } else {
            overlayOpacity.value = withTiming(1, {
              duration: 150,
              easing: Easing.ease,
            });
            runOnJS(setActive)(true);
          }
        })
        .cancelsTouchesInView(false),
    [setActive],
  );

  // const fetchChapter = React.useCallback(async (chapterLink: string) => {
  //   try {
  //     const p = await source.
  //   }
  // }, [source])

  React.useEffect(() => {
    const listener = Dimensions.addEventListener('change', ({ window }) => {
      if (window.width > window.height) {
        flatListRef.current?.scrollToOffset({
          offset: scrollPositionLandscape.current,
        });
      } else {
        flatListRef.current?.scrollToOffset({
          offset: scrollPositionPortrait.current,
        });
      }
    });

    setCurrentChapter(chapterKey);
    localRealm.write(() => {
      chapter.dateRead = Date.now();
    });
    realm.write(() => {
      manga.currentlyReadingChapter = {
        _id: chapter._id,
        index: chapter.indexPage,
      };
    });

    fetchPagesByChapter({ chapter, source });
    StatusBar.setHidden(true);
    return () => {
      StatusBar.setHidden(false);
      resetReaderState();
      listener.remove();
    };
  }, []);

  React.useEffect(() => {
    if (!loading)
      if (!shouldTrackScrollPosition) {
        const scrollBack = setInterval(() => {
          if (width > height) {
            flatListRef.current?.scrollToOffset({
              offset: chapter.scrollPositionLandscape,
              animated: false,
            });
            if (
              100 >=
              Math.abs(
                scrollPositionLandscape.current -
                  chapter.scrollPositionLandscape,
              )
            ) {
              shouldTrackScrollPositionRef.current = true;
              setShouldTrackScrollPosition(true);
            }
          } else {
            flatListRef.current?.scrollToOffset({
              animated: false,
              offset: chapter.scrollPositionPortrait,
            });
            if (
              100 >=
              Math.abs(
                scrollPositionPortrait.current - chapter.scrollPositionPortrait,
              )
            ) {
              shouldTrackScrollPositionRef.current = true;
              setShouldTrackScrollPosition(true);
            }
          }
        }, 1);
        return () => {
          clearInterval(scrollBack);
        };
      } else {
        const interval = setInterval(() => {
          localRealm.write(() => {
            chapter.scrollPositionLandscape = scrollPositionLandscape.current;
            chapter.scrollPositionPortrait = scrollPositionPortrait.current;
          });
        }, 1000);
        return () => {
          clearInterval(interval);
        };
      }
  }, [shouldTrackScrollPosition, loading]);

  const renderItem: ListRenderItem<Page> = React.useCallback(
    ({ item }) => {
      switch (item.type) {
        case 'PAGE':
          return (
            <ChapterPage
              page={item}
              tapGesture={tapGesture}
              mangaKey={mangaKey}
            />
          );
        default:
          return null;
      }
    },
    [tapGesture, mangaKey],
  );

  const handleOnViewableItemsChanged = (info: {
    viewableItems: ViewToken[];
    changed: ViewToken[];
  }) => {
    const page = info.viewableItems.shift();
    if (page != null) {
      const { index } = page;
      if (index != null && shouldTrackScrollPositionRef.current) {
        setCurrentPage(index + 1);
      }
    }
  };

  React.useEffect(() => {
    return () => {
      realm.write(() => {
        manga.currentlyReadingChapter = {
          _id: chapter._id,
          index: currentPage - 1,
        };
      });
      localRealm.write(() => {
        chapter.indexPage = currentPage - 1;
      });
    };
  }, []);

  const viewabilityConfigCallbackPairs =
    React.useRef<ViewabilityConfigCallbackPairs>([
      {
        onViewableItemsChanged: handleOnViewableItemsChanged,
        viewabilityConfig: { viewAreaCoveragePercentThreshold: 90 },
      },
    ]);

  const handleOnScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { width, height } = e.nativeEvent.layoutMeasurement;
    const isPortrait = height > width;
    const offset = horizontal
      ? e.nativeEvent.contentOffset.x
      : e.nativeEvent.contentOffset.y;
    if (isPortrait) {
      scrollPositionPortrait.current = offset;
      scrollPositionLandscape.current = (offset / width) * height;
    } else {
      scrollPositionLandscape.current = offset;
      scrollPositionPortrait.current = (offset / width) * height;
    }
  };

  return (
    <>
      <FlatList
        ref={flatListRef}
        ListHeaderComponent={
          <Overlay
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
        onScroll={handleOnScroll}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        maxToRenderPerBatch={7}
        horizontal={horizontal}
        data={pages}
        inverted={reversed}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        pagingEnabled={pagingEnabled}
        contentContainerStyle={contentContainerStyle}
      />
    </>
  );
};

const keyExtractor = (p: Page, i: number) => `${i}`;

export default connector(Reader);
