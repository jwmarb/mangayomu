/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Box from '@components/Box';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
import { SORT_CHAPTERS_BY, useManga } from '@database/schemas/Manga';
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
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import languages, { ISOLangCode } from '@mangayomu/language-codes';
import { inPlaceSort } from 'fast-sort';
import integrateSortedList from '@helpers/integrateSortedList';

const DEFAULT_LANGUAGE: ISOLangCode = 'en';

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
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const handleOnBookmark = React.useCallback(() => {
    update((mangaObj) => {
      mangaObj.inLibrary = !mangaObj.inLibrary;
      displayMessage(
        mangaObj.inLibrary ? 'Added to library' : 'Removed from library',
      );
      if (mangaObj.inLibrary) mangaObj.dateAddedInLibrary = new Date();
      else mangaObj.dateAddedInLibrary = undefined;
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
      backButtonRippleColor: theme.palette.action.ripple,
      loading: status === 'loading',
      headerRight: (
        <IconButton
          color={{ custom: theme.palette.mangaViewerBackButtonColor }}
          rippleColor={theme.palette.action.ripple}
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
  const realm = useRealm();

  const multilingualChapters = React.useMemo(
    () => chapters.filtered(`manga == "${params.link}"`),
    [chapters],
  );

  const selectedLanguageChapters = React.useMemo(
    () =>
      multilingualChapters.filtered(
        `language == "${
          manga?.selectedLanguage === 'Use default language'
            ? DEFAULT_LANGUAGE
            : manga?.selectedLanguage
        }"`,
      ),
    [multilingualChapters, manga?.selectedLanguage],
  );

  const sortfn = React.useCallback(
    (a: string) =>
      SORT_CHAPTERS_BY[manga!.sortChaptersBy](
        realm.objectForPrimaryKey('Chapter', a)!,
      ),
    [manga != null, realm],
  );

  const data = React.useMemo(
    () =>
      manga
        ? inPlaceSort(selectedLanguageChapters.map((x) => x.link)).by(
            manga.reversedSort
              ? {
                  desc: sortfn,
                }
              : {
                  asc: sortfn,
                },
          )
        : [],
    [manga?.chapters, manga?.selectedLanguage],
  );

  function handleOnRefresh() {
    setRefreshing(true);
  }

  React.useEffect(() => {
    if (refreshing) {
      try {
        refresh();
      } finally {
        setRefreshing(false);
      }
    }
  }, [refreshing]);

  return (
    <>
      <FlashList
        data={data}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleOnRefresh} />
        }
        ListHeaderComponent={
          <MangaViewerHeader
            onOpenMenu={handleOnOpenMenu}
            numberOfSelectedLanguageChapters={selectedLanguageChapters.length}
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
          sortMethod={manga.sortChaptersBy}
          reversed={manga.reversedSort ?? false}
          mangaLink={params.link}
          selectedLanguage={manga.selectedLanguage}
          supportedLanguages={manga.availableLanguages}
        />
      )}
    </>
  );
};

const renderItem: ListRenderItem<string> = ({ item }) => (
  <RowChapter rowChapterKey={item} />
);

export default MangaView;
