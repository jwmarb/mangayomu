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
import useMangaSource from '@hooks/useMangaSource';
import { Page } from '@redux/slices/reader/reader';
import ChapterPage from '@screens/Reader/components/ChapterPage';
import Overlay from '@screens/Reader/components/Overlay';
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
import {
  FlatList,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import {
  Easing,
  runOnJS,
  useDerivedValue,
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

const Reader: React.FC<ConnectedReaderProps> = (props) => {
  const {
    chapter: chapterKey,
    notifyOnLastChapter,
    resetReaderState,
    setCurrentChapter,
    horizontal,
    pages,
    backgroundColor,
    fetchPagesByChapter,
    manga: mangaKey,
  } = props;
  const realm = useRealm();
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
  const source = useMangaSource(manga.source);
  const contentContainerStyle = React.useMemo(
    () => [styles.container, { backgroundColor }],
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
    return () => {
      resetReaderState();
    };
  }, []);

  const renderItem: ListRenderItem<Page> = React.useCallback(
    ({ item }) => {
      switch (item.type) {
        case 'PAGE':
          return <ChapterPage page={item} tapGesture={tapGesture} />;
        default:
          return null;
      }
    },
    [tapGesture],
  );

  const handleOnViewableItemsChanged = (info: {
    viewableItems: ViewToken[];
    changed: ViewToken[];
  }) => {
    const page = info.viewableItems.shift();
    if (page != null) {
      const { index } = page;
      if (index != null) {
        realm.write(() => {
          manga.currentlyReadingChapter = {
            _id: chapter._id,
            index,
          };
        });
        localRealm.write(() => {
          chapter.indexPage = index;
        });
      }
    }
  };
  const viewabilityConfigCallbackPairs =
    React.useRef<ViewabilityConfigCallbackPairs>([
      {
        onViewableItemsChanged: handleOnViewableItemsChanged,
        viewabilityConfig: { viewAreaCoveragePercentThreshold: 50 },
      },
    ]);

  const handleOnScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // const { width, height } = e.nativeEvent.layoutMeasurement;
    // if (width > height) {
    //   // Landscape
    //   console.log('Landscape ', width, height);
    // } else {
    //   // Portrait
    //   console.log('Portrait ', width, height);
    // }
  };

  return (
    <>
      <FlatList
        ListHeaderComponent={
          <Overlay
            manga={manga}
            chapter={chapter}
            opacity={overlayOpacity}
            active={active}
            mangaTitle={manga.title}
          />
        }
        ListEmptyComponent={
          <Box flex-grow align-items="center" justify-content="center">
            <Progress />
          </Box>
        }
        updateCellsBatchingPeriod={10}
        onScroll={handleOnScroll}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        maxToRenderPerBatch={7}
        windowSize={9}
        horizontal={horizontal}
        data={pages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        pagingEnabled
        contentContainerStyle={contentContainerStyle}
      />
    </>
  );
};

const keyExtractor = (p: Page, i: number) => `${i}`;

export default connector(Reader);
