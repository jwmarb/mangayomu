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
import { BackHandler, ImageBackground, Linking, Share } from 'react-native';
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

const rowRenderer: (
  type: string | number,
  data: ReadingChapterInfo & { manga: Manga },
  index: number,
  extendedState: {
    chaptersList: ChaptersListReducerState;
    chaptersInManga: ReadingChapterInfoRecord;
    metas: Record<string, ChapterState> | undefined;
    width: number;
    manga: ReadingMangaInfo;
  }
) => JSX.Element | JSX.Element[] | null = (type, data, i, extendedState) => {
  if (data.link in extendedState.chaptersInManga === false) return null;
  return (
    <Chapter
      isCurrentlyBeingRead={extendedState.manga.currentlyReadingChapter === data.link}
      width={extendedState.width}
      manga={data.manga}
      chapter={extendedState.chaptersInManga[data.link]}
      status={extendedState.chaptersInManga[data.link]?.status ?? DownloadStatus.VALIDATING}
      isSelected={getKey(data) in extendedState.chaptersList.selected}
      selectionMode={extendedState.chaptersList.mode}
      totalPages={extendedState.metas ? extendedState.metas[data.link]?.totalPages ?? 0 : 0}
      totalProgress={extendedState.metas ? extendedState.metas[data.link]?.totalProgress ?? 0 : 0}
      downloadedPages={extendedState.metas ? extendedState.metas[data.link]?.downloadedPages ?? 0 : 0}
    />
  );
};
const dataProviderFn = (r1: ReadingChapterInfo, r2: ReadingChapterInfo) => r1 !== r2;

const MangaViewer: React.FC<MangaViewerProps> = (props) => {
  const {
    route: {
      params: { manga },
    },
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
  } = props;
  const isFocused = useIsFocused();
  const theme = useTheme();
  const {
    state: [meta],
    loading,
    error,
    refresh,
  } = useAPICall(() => source.getMeta(manga), [manga, isFocused]);
  const [language, setLanguage] = React.useState<ISOLangCode>('en');
  const [dataProvider, setDataProvider] = React.useState<DataProvider>(new DataProvider(dataProviderFn));

  const options: UseCollapsibleOptions = React.useMemo(
    () => ({
      navigationOptions: {
        header: Header,
        headerRight: () => <HeaderRight manga={manga} />,
        headerTitle: '',
      },
      config: {
        useNativeDriver: true,
      },
    }),
    [userMangaInfo?.inLibrary]
  );

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
  const collapsible = useCollapsibleHeader(options);
  const { ready, Fallback } = useLazyLoading();
  const loadingAnimation = useAnimatedLoading();
  const sorted = React.useRef<MangaChapter[]>([]);
  const isAdult = React.useMemo(
    () => userMangaInfo && MangaValidator.isNSFW(userMangaInfo.genres),
    [userMangaInfo?.genres]
  );

  React.useEffect(() => {
    if (meta) {
      viewManga({ ...manga, ...meta });
    }
  }, [meta]);

  React.useEffect(() => {
    exitSelectionMode();
    return () => {
      exitSelectionMode();
      // DownloadManager.clearRefs();
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
      checkAll(newVal, dataProvider.getAllData());
      if (newVal && sorted.current.every(MangaValidator.isMultilingualChapter))
        displayMessage(
          `Selected all ${
            languages[(dataProvider.getDataForIndex(0) as MangaMultilingualChapter).language].name
          } chapters`
        );
    },
    [dataProvider]
  );

  const handleOnSelectAllDownloaded = React.useCallback(async () => {
    const filtered: ReadingChapterInfo[] = [];
    for (let i = 0; i < dataProvider.getAllData().length; i++) {
      if (await DownloadManager.peek(dataProvider.getAllData()[i])?.isDownloaded())
        filtered.push(dataProvider.getAllData()[i]);
    }
    checkAllChapters(filtered);
  }, [dataProvider]);

  const handleOnSelectAllUnread = React.useCallback(async () => {
    checkAllChapters(dataProvider.getAllData().filter((c) => c.dateRead == null));
  }, [dataProvider]);

  const handleOnSelectAllRead = React.useCallback(async () => {
    checkAllChapters(dataProvider.getAllData().filter((c) => c.dateRead != null));
  }, [dataProvider]);

  const handleOnRead = React.useCallback(() => {
    if (userMangaInfo) {
      if (userMangaInfo.currentlyReadingChapter)
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
          return userMangaInfo.currentlyReadingChapter
            ? (userMangaInfo.chapters[userMangaInfo.currentlyReadingChapter] as unknown as MangaMultilingualChapter)
                .language
            : (sort as unknown as MangaMultilingualChapter[])[0]?.language ?? 'en';
        });
        setDataProvider((p) =>
          p.cloneWithRows(
            sort
              .filter((x: unknown) => (x as MangaMultilingualChapter).language === language)
              .map((p) => ({ ...p, manga }))
          )
        );
      } else setDataProvider((p) => p.cloneWithRows(sort.map((p) => ({ ...p, manga }))));
      sorted.current = sort;
      initializeChapters(userMangaInfo.orderedChapters.toArray(), userMangaInfo);
    }
  }, [userMangaInfo?.chapters, sort, reverse]);

  // React.useEffect(() => {
  //   if (sorted && sorted.every(MangaValidator.isMultilingualChapter)) {
  //     setLanguage((prev) => {
  //       if (prev !== 'en') return prev;
  //       return (sorted as unknown as MangaMultilingualChapter[])[0]?.language ?? 'en';
  //     });
  //   }
  // } , [sorted])

  React.useEffect(() => {
    if (sorted && sorted.current.every(MangaValidator.isMultilingualChapter)) {
      setDataProvider((p) =>
        p.cloneWithRows(
          sorted.current
            .filter((x: unknown) => (x as MangaMultilingualChapter).language === language)
            .map((p) => ({ ...p, manga }))
        )
      );
    } else if (sorted) setDataProvider((p) => p.cloneWithRows(sorted.current.map((p) => ({ ...p, manga }))));
  }, [language]);

  return (
    <React.Suspense fallback={null}>
      {ready && isFocused ? (
        <AnimatedProvider style={loadingAnimation}>
          <Overview
            onRead={handleOnRead}
            rowRenderer={rowRenderer as any}
            manga={manga}
            chapters={userMangaInfo?.orderedChapters.toArray()}
            loading={loading}
            dataProvider={dataProvider}
            currentChapter={
              userMangaInfo
                ? userMangaInfo.currentlyReadingChapter
                  ? userMangaInfo.chapters[userMangaInfo.currentlyReadingChapter]
                  : null
                : null
            }
            collapsible={collapsible}>
            <MangaViewerContainer>
              <ImageBackground source={{ uri: manga.imageCover }}>
                <LinearGradient colors={['transparent', '#171717']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.7 }}>
                  <MangaViewerImageBackdrop paddingTop={collapsible.containerPaddingTop}>
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
                    <MangaAction manga={manga} userMangaInfo={userMangaInfo} onRead={handleOnRead} />
                  </MangaViewerImageBackdrop>
                </LinearGradient>
              </ImageBackground>
              <Spacer y={2} />
              <Description description={userMangaInfo?.description} loading={loading} />
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
              chapters={meta?.chapters}
              sort={sort}
              handleOnOpenModal={handleOnOpenModal}
              loading={loading}
            />
            <LanguageModal visible={visible} onCloseModal={handleOnCloseModal} sortOptions={sortOptions} />
            <SelectedChapters numOfChapters={meta?.chapters.length ?? 0} manga={manga} />
          </Overview>
        </AnimatedProvider>
      ) : (
        Fallback
      )}
    </React.Suspense>
  );
};

export default connector(MangaViewer);
