import Box from '@components/Box';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
import { useManga } from '@database/schemas/Manga';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React from 'react';
import MangaViewerHeader from './components/MangaViewerHeader';
import { useTheme } from '@emotion/react';
import IconButton from '@components/IconButton';
import Icon from '@components/Icon';
import { useObject, useQuery, useRealm } from '@database/main';
import displayMessage from '@helpers/displayMessage';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { NAVHEADER_HEIGHT } from '@components/NavHeader';
import Text from '@components/Text';
import { ChapterSchema } from '@database/schemas/Chapter';
import RowChapter from '@screens/MangaView/components/RowChapter';
import { ROW_CHAPTER_HEIGHT } from '@screens/MangaView/components/RowChapter/RowChapter';
import Divider from '@components/Divider';
import { CustomBottomSheet } from '@components/CustomBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import MangaViewModal from '@screens/MangaView/components/MangaViewModal';
import { FlatList } from 'react-native-gesture-handler';

const MangaView: React.FC<RootStackProps<'MangaView'>> = (props) => {
  const {
    route: { params },
    navigation,
  } = props;
  const theme = useTheme();
  const ref = React.useRef<BottomSheet>(null);
  const { manga, status, error, refresh, update } = useManga(params, {
    preferLocal: false,
  });
  const handleOnBookmark = React.useCallback(() => {
    update((mangaObj) => {
      mangaObj.inLibrary = !mangaObj.inLibrary;
      displayMessage(
        mangaObj.inLibrary ? 'Added to library' : 'Removed from library',
      );
    });
  }, [update]);
  const scrollPosition = useSharedValue(0);
  const buttonStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      scrollPosition.value,
      [0, NAVHEADER_HEIGHT],
      [theme.palette.mangaViewerBackButtonColor, theme.palette.text.secondary],
    ),
  }));
  const { onScroll, contentContainerStyle, scrollViewStyle } =
    useCollapsibleHeader({
      headerTitle: '',
      backButtonColor: { custom: theme.palette.mangaViewerBackButtonColor },
      backButtonStyle: buttonStyle,
      headerRight: (
        <IconButton
          color={{ custom: theme.palette.mangaViewerBackButtonColor }}
          animated
          onPress={handleOnBookmark}
          icon={
            <Icon
              type="font"
              name={manga?.inLibrary ? 'bookmark' : 'bookmark-outline'}
              style={buttonStyle}
            />
          }
        />
      ),
      dependencies: [theme, manga?.inLibrary],
    });

  function handleOnScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    onScroll(e);
    scrollPosition.value = e.nativeEvent.contentOffset.y;
  }

  function handleOnOpenMenu() {
    ref.current?.snapToIndex(1);
  }

  const chapters = useQuery(ChapterSchema);

  const multilingualChapters = React.useMemo(
    () => chapters.filtered(`manga == "${params.link}"`),
    [chapters],
  );

  const selectedLanguageChapters = React.useMemo(
    () => multilingualChapters.filtered('language == "en"'),
    [multilingualChapters],
  );

  return (
    <>
      <FlashList
        data={manga?.chapters ?? []}
        ListHeaderComponent={
          <MangaViewerHeader
            onOpenMenu={handleOnOpenMenu}
            numberOfSelectedLanguageChapters={selectedLanguageChapters.length}
            queriedChaptersForManga={multilingualChapters}
            onBookmark={handleOnBookmark}
            status={status}
            manga={params}
            meta={manga}
            error={error}
            refresh={refresh}
            scrollViewStyle={scrollViewStyle}
          />
        }
        ListFooterComponent={<Box style={contentContainerStyle} />}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
        estimatedItemSize={ROW_CHAPTER_HEIGHT}
        {...{ onScroll: handleOnScroll }}
      />
      {manga != null && (
        <MangaViewModal
          ref={ref}
          sortMethod={manga?.sortChaptersBy ?? 'Chapter number'}
          reversed={manga?.reversedSort ?? false}
          mangaLink={params.link}
        />
      )}
    </>
  );
};

const renderItem: ListRenderItem<string> = ({ item }) => (
  <RowChapter rowChapterKey={item} />
);

export default MangaView;
