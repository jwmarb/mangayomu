import Box from '@components/Box';
import Text from '@components/Text';
import { useLocalObject, useObject } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaSchema } from '@database/schemas/Manga';
import useMangaSource from '@hooks/useMangaSource';
import { Page } from '@redux/slices/reader/reader';
import ChapterPage from '@screens/Reader/components/ChapterPage';
import Overlay from '@screens/Reader/components/Overlay';
import React from 'react';
import { ListRenderItem, useWindowDimensions } from 'react-native';
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
    horizontal,
    pages,
    backgroundColor,
    fetchPagesByChapter,
    manga: mangaKey,
  } = props;
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
    fetchPagesByChapter({ chapter, source });
    return () => {
      resetReaderState();
    };
  }, []);

  return (
    <>
      <Overlay opacity={overlayOpacity} active={active} />
      <FlatList
        updateCellsBatchingPeriod={10}
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

const renderItem: ListRenderItem<Page> = ({ item }) => {
  switch (item.type) {
    case 'PAGE':
      return <ChapterPage page={item} />;
    default:
      return null;
  }
};

const keyExtractor = (p: Page, i: number) => `${i}`;

export default connector(Reader);
