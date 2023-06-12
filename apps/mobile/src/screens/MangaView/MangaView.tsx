/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Box from '@components/Box';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import { SORT_CHAPTERS_BY, useManga } from '@database/schemas/Manga';
import { ListRenderItem } from '@shopify/flash-list';
import React from 'react';
import MangaViewerHeader from './components/MangaViewerHeader';
import { useTheme } from '@emotion/react';
import IconButton from '@components/IconButton';
import Icon from '@components/Icon';
import { useLocalQuery, useLocalRealm } from '@database/main';
import displayMessage from '@helpers/displayMessage';
import { Linking, NativeScrollEvent, Share } from 'react-native';
import {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { NAVHEADER_HEIGHT } from '@components/NavHeader';
import { ChapterSchema } from '@database/schemas/Chapter';
import RowChapter from '@screens/MangaView/components/RowChapter';
import { ROW_CHAPTER_HEIGHT } from '@screens/MangaView/components/RowChapter/RowChapter';
import Divider from '@components/Divider';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import MangaViewModal from '@screens/MangaView/components/MangaViewModal';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { ISOLangCode } from '@mangayomu/language-codes';
import { inPlaceSort } from 'fast-sort';
import connector, {
  ConnectedMangaViewProps,
} from '@screens/MangaView/MangaView.redux';
import Text from '@components/Text';
import { moderateScale } from 'react-native-size-matters';
import Stack from '@components/Stack';
import { AnimatedFlashList } from '@components/animated';
import InternetStatusToast from '@screens/MangaView/components/InternetStatusToast/InternetStatusToast';
import QuickReadButton from '@screens/MangaView/components/QuickReadButton/QuickReadButton';

export const DEFAULT_LANGUAGE: ISOLangCode = 'en';

const MangaView: React.FC<ConnectedMangaViewProps> = (props) => {
  const {
    route: { params },
    addIfNewSourceToLibrary,
    internetStatus,
  } = props;
  const theme = useTheme();
  const ref = React.useRef<BottomSheet>(null);
  const { manga, status, error, refresh, update } = useManga(params, {
    preferLocal: false,
  });
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const handleOnBookmark = React.useCallback(() => {
    update((mangaObj) => {
      addIfNewSourceToLibrary(mangaObj.source);
      mangaObj.inLibrary = !mangaObj.inLibrary;
      displayMessage(
        mangaObj.inLibrary ? 'Added to library' : 'Removed from library',
      );
      if (mangaObj.inLibrary) mangaObj.dateAddedInLibrary = Date.now();
      else mangaObj.dateAddedInLibrary = undefined;
    });
  }, [update]);
  const scrollPosition = useSharedValue(0);
  const buttonInterpolateColor =
    theme.mode === 'dark'
      ? theme.palette.text.secondary
      : theme.helpers.getContrastText(theme.palette.background.paper);

  const buttonStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      scrollPosition.value,
      [0, NAVHEADER_HEIGHT],
      [theme.palette.mangaViewerBackButtonColor, buttonInterpolateColor],
    ),
  }));

  const textOpacity = useSharedValue(0);
  const networkStatusOffset = useSharedValue(moderateScale(32));

  const handleOnScroll = (e: NativeScrollEvent) => {
    scrollPosition.value = e.contentOffset.y;
    if (e.velocity != null) {
      if (e.velocity.y < 0)
        textOpacity.value = withTiming(1, {
          duration: 250,
          easing: Easing.linear,
        });
      else
        textOpacity.value = withTiming(0, {
          duration: 250,
          easing: Easing.linear,
        });
    }
  };

  const { onScroll, contentContainerStyle, scrollViewStyle } =
    useCollapsibleHeader({
      headerTitle: '',
      onScroll: handleOnScroll,
      backButtonColor: { custom: theme.palette.mangaViewerBackButtonColor },
      backButtonStyle: buttonStyle,
      backButtonRippleColor: theme.palette.action.ripple,
      loading: status === 'loading',
      headerRight: (
        <>
          {manga == null ? undefined : (
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
          )}
          <IconButton
            color={{ custom: theme.palette.mangaViewerBackButtonColor }}
            rippleColor={theme.palette.action.ripple}
            animated
            icon={<Icon type="font" name="web" style={buttonStyle} />}
            onPress={async () => {
              const canOpenURL = await Linking.canOpenURL(params.link);
              if (canOpenURL) Linking.openURL(params.link);
            }}
            onLongPress={async () => {
              await Share.share({
                url: params.link,
                message: params.link,
              });
            }}
          />
        </>
      ),
      dependencies: [theme, manga?.inLibrary, manga == null],
    });

  function handleOnOpenMenu() {
    ref.current?.snapToIndex(1);
  }
  const localRealm = useLocalRealm();

  const chapters = useLocalQuery(ChapterSchema);

  const multilingualChapters = React.useMemo(
    () => chapters.filtered(`_mangaId == "${params.link}"`),
    [chapters, params.link],
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
        localRealm.objectForPrimaryKey('Chapter', a)!,
      ),
    [manga != null, localRealm],
  );

  const data = React.useMemo(
    () =>
      manga
        ? inPlaceSort(selectedLanguageChapters.map((x) => x._id)).by(
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

  const firstChapter = React.useMemo(
    () =>
      selectedLanguageChapters.filtered(
        `index == ${selectedLanguageChapters.length - 1}`,
      )[0],
    [selectedLanguageChapters],
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

  const renderItem: ListRenderItem<string> = React.useCallback(
    ({ item }) => (
      <RowChapter
        rowChapterKey={item}
        isReading={manga?.currentlyReadingChapter?._id === item}
      />
    ),
    [manga?.currentlyReadingChapter?._id],
  );

  if (manga == null && internetStatus === 'offline')
    return (
      <ScrollView
        onScroll={onScroll}
        contentContainerStyle={contentContainerStyle}
        style={scrollViewStyle}
      >
        <Stack maxWidth="80%" align-self="center" space="s">
          <Box align-items="center" justify-content="center">
            <Icon
              type="font"
              name="wifi-off"
              size={moderateScale(120)}
              color="textSecondary"
            />
            <Text variant="header" bold align="center">
              You are offline
            </Text>
            <Text color="textSecondary" align="center">
              Could not resolve a local version of{' '}
              <Text bold>{params.title}</Text>
            </Text>
          </Box>
          <Box align-items="center" justify-content="center">
            <Text color="textSecondary" align="center">
              Once you are online, this page will reload automatically.
            </Text>
          </Box>
        </Stack>
      </ScrollView>
    );

  return (
    <>
      <AnimatedFlashList
        data={data}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleOnRefresh} />
        }
        ListHeaderComponent={
          <MangaViewerHeader
            firstChapterKey={firstChapter?._id}
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
        onScroll={onScroll}
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
      <Box
        position="absolute"
        top={0}
        bottom={0}
        left={0}
        right={0}
        pointerEvents="box-none"
      >
        <InternetStatusToast
          manga={manga}
          networkStatusOffset={networkStatusOffset}
        />
        <QuickReadButton
          firstChapter={firstChapter}
          mangaKey={manga?._id}
          currentlyReadingChapter={manga?.currentlyReadingChapter}
          networkStatusOffset={networkStatusOffset}
          textOpacity={textOpacity}
        />
      </Box>
    </>
  );
};

export default connector(MangaView);
