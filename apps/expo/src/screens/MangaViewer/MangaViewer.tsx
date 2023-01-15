import {
  Flex,
  Spacer,
  IconButton,
  Icon,
  Header,
  Progress,
  Container,
  Modal,
  Typography,
  SortTypeItem,
  List,
  Chapter,
} from '@components/core';
import useAPICall from '@hooks/useAPICall';

import React from 'react';
import { useCollapsibleHeader, UseCollapsibleOptions } from 'react-navigation-collapsible';
import MangaValidator from '@utils/MangaValidator';
import StatusIndicator from '@screens/MangaViewer/components/StatusIndicator';
import connector, { MangaViewerProps } from '@screens/MangaViewer/MangaViewer.redux';
import { MangaViewerContainer, MangaViewerImageBackdrop } from '@screens/MangaViewer/MangaViewer.base';
import useAnimatedLoading from '@hooks/useAnimatedLoading';
import { AnimatedProvider } from '@context/AnimatedContext';
import useLazyLoading from '@hooks/useLazyLoading';
import useSort from '@hooks/useSort';
import { Manga, MangaChapter, MangaMultilingualChapter, WithDate } from '@services/scraper/scraper.interfaces';
import { HeaderBuilder } from '@components/Screen/Header/Header.base';
import { ISOLangCode, languages } from '@utils/languageCodes';
import {
  Animated,
  BackHandler,
  ImageBackground,
  InteractionManager,
  Linking,
  ListRenderItem,
  ListRenderItemInfo,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'styled-components/native';
import { ChapterPressableMode, ChapterRef } from '@components/Chapter/Chapter.interfaces';
import { GRADIENT_COLOR } from './MangaViewer.shared';
import pLimit from 'p-limit';
import * as FileSystem from 'expo-file-system';
import { Constants } from '@theme/core';
import { ChapterContext } from '@context/ChapterContext';
import useMountedEffect from '@hooks/useMountedEffect';
import {
  MangaReducerState,
  ReadingChapterInfo,
  ReadingChapterInfoRecord,
  ReadingMangaInfo,
} from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import DownloadCollection from '@utils/DownloadCollection';
import DownloadManager, { DownloadStatus } from '@utils/DownloadManager';
import { ChaptersListReducerState } from '@redux/reducers/chaptersListReducer/chaptersListReducer.interfaces';
import SelectedChapters from '@screens/MangaViewer/components/SelectedChapters';
import { getKey } from '@redux/reducers/chaptersListReducer/chaptersListReducer';
import {
  ChapterState,
  MangaDownloadingReducerState,
} from '@redux/reducers/mangaDownloadingReducer/mangaDownloadingReducer.interfaces';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import HeaderRight from '@screens/MangaViewer/components/HeaderRight';
import onlyDisplayOnFocus from '@utils/onlyDisplayOnFocus';
import { PortalHost } from '@gorhom/portal';
import { DataProvider } from 'recyclerlistview';
import displayMessage from '@utils/displayMessage';
import { keyExtractor } from './MangaViewer.flatlist';
import { RFValue } from 'react-native-responsive-fontsize';
const LanguageModal = React.lazy(() => import('@screens/MangaViewer/components/LanguageModal'));
const Genres = React.lazy(() => import('@screens/MangaViewer/components/Genres'));
const ChapterHeader = React.lazy(() => import('@screens/MangaViewer/components/ChapterHeader'));
const Title = React.lazy(() => import('@screens/MangaViewer/components/Title'));
const Description = React.lazy(() => import('@screens/MangaViewer/components/Description'));
const Authors = React.lazy(() => import('@screens/MangaViewer/components/Authors'));
const MangaCover = React.lazy(() => import('@screens/MangaViewer/components/MangaCover'));
const MangaAction = React.lazy(() => import('@screens/MangaViewer/components/MangaAction'));
const Overview = React.lazy(() => import('@screens/MangaViewer/components/Overview'));
const MangaRating = React.lazy(() => import('@screens/MangaViewer/components/MangaRating'));

function compareChapter(a: MangaChapter, b: MangaChapter) {
  if (a.name && b.name) {
    const aName = a.name.match(/(0|[1-9]\d*)(\.\d+)?/g);
    const bName = b.name.match(/(0|[1-9]\d*)(\.\d+)?/g);
    if (aName != null && bName != null) return parseFloat(bName[0]) - parseFloat(aName[0]);
  }
  if (a.index != null && b.index != null) return b.index - a.index;
  throw Error(`Chapter cannot be sorted due to undefined name and index`);
}

const MangaViewer: React.FC<MangaViewerProps> = (props) => {
  const {
    route: {
      params: { manga },
    },
    extendedState,
    navigation,
    viewManga,
    userMangaInfo,
    source,
    exitSelectionMode,
    selectionMode,
    checked,
    checkAllChapters,
    checkAll,
    initializeChapters,
    hideFloatingModal,
    inLibrary,
  } = props;

  const isFocused = useIsFocused();
  const theme = useTheme();
  // const {
  //   state: [meta],
  //   loading,
  //   error,
  //   refresh,
  // } = useAPICall(() => source.getMeta(manga), [manga, isFocused]);
  const [loading, setLoading] = React.useState<boolean>(true);

  async function refresh() {
    if (!loading) setLoading(true);
    try {
      const meta = await source.getMeta(manga);
      viewManga(meta);
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  }
  React.useEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      refresh();
    });
  }, []);

  const [language, setLanguage] = React.useState<ISOLangCode>('en');
  const [chapters, setChapters] = React.useState<ReadingChapterInfo[]>([]);
  const options: UseCollapsibleOptions = {
    navigationOptions: {
      header: Header,
      headerRight: () => <HeaderRight manga={manga} />,
      headerTitle: '',
    },
    config: {
      useNativeDriver: true,
    },
  };

  const { containerPaddingTop, scrollIndicatorInsetTop, onScroll } = useCollapsibleHeader(options);

  const {
    sort,
    reverse,
    visible,
    handleOnCloseModal: _handleOnCloseModal,
    handleOnOpenModal: _handleOnOpenModal,
    sortOptions,
    selectedSortOption,
  } = useSort(
    (createSort) => ({
      'Chapter number': createSort(compareChapter),
      ...(MangaValidator.hasDate(userMangaInfo?.orderedChapters.get(0) ?? {})
        ? {
            'Date released': createSort((a: WithDate, b: WithDate) => Date.parse(a.date) - Date.parse(b.date)),
          }
        : {}),
    }),
    'Chapter number'
  );
  const handleOnOpenModal = React.useCallback(() => {
    _handleOnOpenModal();
    hideFloatingModal(true);
  }, [_handleOnOpenModal, hideFloatingModal]);
  const handleOnCloseModal = React.useCallback(() => {
    _handleOnCloseModal();
    hideFloatingModal(false);
  }, [_handleOnCloseModal, hideFloatingModal]);
  const loadingAnimation = useAnimatedLoading();
  const [sorted, setSorted] = React.useState<MangaChapter[]>([]);
  const isAdult = React.useMemo(
    () => userMangaInfo && MangaValidator.isNSFW(userMangaInfo.genres),
    [userMangaInfo?.genres]
  );

  React.useEffect(() => {
    exitSelectionMode();
    return () => {
      exitSelectionMode();
    };
  }, []);

  React.useEffect(() => {
    if (selectionMode === 'selection') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        exitSelectionMode();
        return true;
      });
      return () => backHandler.remove();
    }
  }, [selectionMode]);

  const handleOnSelectAll = React.useCallback(
    (newVal: boolean) => {
      checkAll(newVal, chapters);
      if (newVal && sorted.every(MangaValidator.isMultilingualChapter))
        displayMessage(
          `Selected all ${languages[(chapters[0] as unknown as MangaMultilingualChapter).language].name} chapters`
        );
    },
    [chapters]
  );

  const handleOnSelectAllDownloaded = React.useCallback(async () => {
    const filtered: ReadingChapterInfo[] = [];
    for (let i = 0; i < chapters.length; i++) {
      if (await DownloadManager.peek(chapters[i])?.isDownloaded()) filtered.push(chapters[i]);
    }
    checkAllChapters(filtered);
  }, [chapters]);

  const handleOnSelectAllUnread = React.useCallback(async () => {
    checkAllChapters(chapters.filter((c) => c.dateRead == null));
  }, [chapters]);

  const handleOnSelectAllRead = React.useCallback(async () => {
    checkAllChapters(chapters.filter((c) => c.dateRead != null));
  }, [chapters]);

  const handleOnRead = React.useCallback(() => {
    if (userMangaInfo) {
      if (
        userMangaInfo.currentlyReadingChapter != null &&
        userMangaInfo.chapters[userMangaInfo.currentlyReadingChapter] != null
      )
        navigation.navigate('Reader', {
          chapterKey: userMangaInfo.chapters[userMangaInfo.currentlyReadingChapter].link,
          mangaKey: userMangaInfo.link,
        });
      else
        navigation.navigate('Reader', {
          chapterKey: userMangaInfo.orderedChapters.get(0).link,
          mangaKey: userMangaInfo.link,
        });
    }
  }, [userMangaInfo]);

  React.useEffect(() => {
    if (userMangaInfo) {
      const sort = Object.values(userMangaInfo.chapters).sort(selectedSortOption);
      if (sort && sort.every(MangaValidator.isMultilingualChapter)) {
        setLanguage((prev) => {
          if (prev !== 'en') return prev;

          return userMangaInfo.currentlyReadingChapter &&
            userMangaInfo.chapters[userMangaInfo.currentlyReadingChapter] != null
            ? (userMangaInfo.chapters[userMangaInfo.currentlyReadingChapter] as unknown as MangaMultilingualChapter)
                .language
            : (sort as unknown as MangaMultilingualChapter[])[0]?.language ?? 'en';
        });
        setChapters(
          sort
            .filter((x: unknown) => (x as MangaMultilingualChapter).language === language)
            .map((p) => ({ ...p, manga }))
        );
      } else setChapters(sort.map((p) => ({ ...p, manga })));
      setSorted(sort);
      initializeChapters(userMangaInfo.orderedChapters.toArray(), userMangaInfo);
    }
  }, [userMangaInfo?.chapters, sort, reverse]);

  React.useEffect(() => {
    if (sorted && sorted.every(MangaValidator.isMultilingualChapter)) {
      setChapters(
        sorted
          .filter((x: unknown) => (x as MangaMultilingualChapter).language === language)
          .map((p: unknown) => ({ ...(p as ReadingChapterInfo), manga }))
      );
    } else if (sorted) setChapters(sorted.map((p: unknown) => ({ ...(p as ReadingChapterInfo), manga })));
  }, [language]);

  const renderItem: ListRenderItem<ReadingChapterInfo> = React.useCallback(
    ({ item: data }) => {
      if (data.link in extendedState.chaptersInManga === false) return null;
      return (
        <Chapter
          isCurrentlyBeingRead={extendedState.manga.currentlyReadingChapter === data.link}
          width={extendedState.width}
          manga={extendedState.manga}
          chapter={extendedState.chaptersInManga[data.link]}
          status={extendedState.chaptersInManga[data.link]?.status ?? DownloadStatus.VALIDATING}
          isSelected={getKey(data) in extendedState.chaptersList.selected}
          selectionMode={extendedState.chaptersList.mode}
          totalPages={extendedState.metas ? extendedState.metas[data.link]?.totalPages ?? 0 : 0}
          totalProgress={extendedState.metas ? extendedState.metas[data.link]?.totalProgress ?? 0 : 0}
          downloadedPages={extendedState.metas ? extendedState.metas[data.link]?.downloadedPages ?? 0 : 0}
        />
      );
    },
    [extendedState]
  );

  return (
    <React.Suspense fallback={null}>
      <AnimatedProvider style={loadingAnimation}>
        <Animated.FlatList
          contentContainerStyle={{ paddingTop: containerPaddingTop }}
          scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
          onScroll={onScroll}
          data={chapters}
          extraData={extendedState}
          renderItem={renderItem}
          // estimatedItemSize={RFValue(60)}
          keyExtractor={keyExtractor}
          ListHeaderComponent={
            <>
              <MangaViewerContainer>
                <ImageBackground source={{ uri: manga.imageCover }}>
                  <LinearGradient colors={['transparent', '#171717']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.7 }}>
                    <MangaViewerImageBackdrop paddingTop={containerPaddingTop}>
                      <Flex container horizontalPadding={3} verticalPadding={0}>
                        <MangaCover mangaCoverURI={manga.imageCover} title={manga.title} />
                        <Spacer x={2} />
                        <Flex direction='column' shrink>
                          <Title title={manga.title} isAdult={isAdult} />
                          <Authors
                            manga={manga}
                            authors={
                              userMangaInfo && MangaValidator.hasAuthors(userMangaInfo) ? userMangaInfo.authors : null
                            }
                          />
                          <Genres genres={userMangaInfo?.genres} source={source} />
                          <Spacer y={1} />
                          <StatusIndicator meta={userMangaInfo} />
                          <MangaRating
                            {...(userMangaInfo && MangaValidator.hasRating(userMangaInfo)
                              ? { rating: { rating: userMangaInfo.rating } }
                              : { rating: null })}
                          />
                        </Flex>
                      </Flex>
                      <MangaAction
                        manga={manga}
                        userMangaInfo={userMangaInfo}
                        inLibrary={inLibrary}
                        onRead={handleOnRead}
                      />
                    </MangaViewerImageBackdrop>
                  </LinearGradient>
                </ImageBackground>
                <Spacer y={2} />
                <Description description={userMangaInfo?.description} metaExists={userMangaInfo != null} />
                <Spacer y={2} />
                <Genres buttons genres={userMangaInfo?.genres} source={source} />
              </MangaViewerContainer>
              <ChapterHeader
                checked={checked}
                onSelectReadChapters={handleOnSelectAllRead}
                onSelectUnreadChapters={handleOnSelectAllUnread}
                onSelectDownloadedChapters={handleOnSelectAllDownloaded}
                onSelectAll={handleOnSelectAll}
                onChangeLanguage={setLanguage}
                language={language}
                refresh={refresh}
                chapters={sorted}
                sort={sort}
                handleOnOpenModal={handleOnOpenModal}
                loading={loading}
              />
              <LanguageModal visible={visible} onCloseModal={handleOnCloseModal} sortOptions={sortOptions} />
              <SelectedChapters numOfChapters={chapters.length ?? 0} manga={manga} />
            </>
          }
        />
      </AnimatedProvider>
    </React.Suspense>
  );
};

export default connector(MangaViewer);
