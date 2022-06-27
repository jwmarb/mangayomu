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
import { Manga, MangaChapter, WithDate } from '@services/scraper/scraper.interfaces';
import { HeaderBuilder } from '@components/Screen/Header/Header.base';
import { ISOLangCode } from '@utils/languageCodes';
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
import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import DownloadCollection from '@utils/DownloadCollection';
import DownloadManager from '@utils/DownloadManager';
import { ChapterState } from '@redux/reducers/chaptersListReducer/chaptersListReducer.interfaces';
import SelectedChapters from '@screens/MangaViewer/components/SelectedChapters';
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

const rowRenderer: (
  type: string | number,
  data: ReadingChapterInfo & { manga: Manga },
  index: number,
  extendedState?: object | undefined
) => JSX.Element | JSX.Element[] | null = (type, data, i) => <Chapter manga={data.manga} chapter={data} />;

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
    checkAllChapters,
    checkAll,
    initializeChapterStates,
  } = props;
  const theme = useTheme();
  const {
    state: [meta],
    loading,
    error,
    refresh,
  } = useAPICall(() => source.getMeta(manga));
  const [language, setLanguage] = React.useState<ISOLangCode>('en');
  const options: UseCollapsibleOptions = React.useMemo(
    () => ({
      navigationOptions: {
        header: Header,
        headerRight: () => (
          <>
            <IconButton
              icon={<Icon bundle='Feather' name='share-2' />}
              onPress={async () => {
                try {
                  await Share.share({
                    title: 'Share URL',
                    message: manga.link,
                    url: manga.link,
                  });
                } catch (e) {
                  alert(e);
                }
              }}
            />
            <IconButton
              icon={<Icon bundle='Feather' name='globe' />}
              onPress={() => {
                Linking.openURL(manga.link);
              }}
            />
          </>
        ),
        headerTitle: '',
      },
      config: {
        useNativeDriver: true,
      },
    }),
    [userMangaInfo?.inLibrary]
  );

  const { sort, reverse, visible, handleOnCloseModal, handleOnOpenModal, sortOptions, selectedSortOption } = useSort(
    (createSort) => ({
      Chapter: createSort((a: MangaChapter, b: MangaChapter) => (a.name && b.name ? a.index - b.index : 0)),
      ...(MangaValidator.hasDate(userMangaInfo?.chapters[0] ?? {})
        ? {
            'Date Released': createSort((a: WithDate, b: WithDate) => Date.parse(a.date) - Date.parse(b.date)),
          }
        : {}),
    }),
    'Chapter'
  );
  const collapsible = useCollapsibleHeader(options);
  const { ready, Fallback } = useLazyLoading();
  const loadingAnimation = useAnimatedLoading();

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

  const [sorted, setSorted] = React.useState(() =>
    Object.values(userMangaInfo?.chapters ?? {}).sort(selectedSortOption)
  );

  React.useEffect(() => {
    if (selectionMode === 'selection') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        exitSelectionMode();
        return true;
      });
      return () => backHandler.remove();
    }
  }, [selectionMode]);

  const handleOnSelectAll = React.useCallback((newVal: boolean) => {
    checkAll(newVal);
  }, []);

  const handleOnSelectAllDownloaded = React.useCallback(async () => {
    const filtered: ReadingChapterInfo[] = [];
    for (let i = 0; i < sorted.length; i++) {
      if (await DownloadManager.peek(sorted[i])?.isDownloaded()) filtered.push(sorted[i]);
    }
    checkAllChapters(filtered);
  }, [sorted]);

  const handleOnSelectAllUnread = React.useCallback(async () => {
    checkAllChapters(sorted.filter((c) => c.dateRead == null));
  }, [sorted]);

  const handleOnSelectAllRead = React.useCallback(async () => {
    checkAllChapters(sorted.filter((c) => c.dateRead != null));
  }, [sorted]);

  React.useEffect(() => {
    const sort = Object.values(userMangaInfo?.chapters ?? {}).sort(selectedSortOption);
    setSorted(sort);
    initializeChapterStates(sort, manga);
  }, [userMangaInfo?.chapters, sort, reverse]);

  if (ready) {
    return (
      <React.Suspense
        fallback={
          <Flex grow alignItems='center' justifyContent='center'>
            <Progress />
          </Flex>
        }>
        <AnimatedProvider style={loadingAnimation}>
          <Overview
            rowRenderer={rowRenderer}
            manga={manga}
            loading={loading}
            onChangeLanguage={setLanguage}
            chapters={sorted}
            language={language}
            currentChapter={userMangaInfo?.currentlyReadingChapter}
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
                    <MangaAction manga={manga} userMangaInfo={userMangaInfo} />
                  </MangaViewerImageBackdrop>
                </LinearGradient>
              </ImageBackground>
              <Spacer y={2} />
              <Description description={userMangaInfo?.description} />
              <Spacer y={2} />
              <Genres buttons genres={userMangaInfo?.genres} source={source} />
            </MangaViewerContainer>
            <ChapterHeader
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
            <SelectedChapters manga={manga} />
          </Overview>
        </AnimatedProvider>
      </React.Suspense>
    );
  }
  return Fallback;
};

export default connector(MangaViewer);
