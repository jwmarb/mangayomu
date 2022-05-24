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
import { MangaChapter, WithDate } from '@services/scraper/scraper.interfaces';
import { HeaderBuilder } from '@components/Screen/Header/Header.base';
import { ISOLangCode } from '@utils/languageCodes';
import { BackHandler, ImageBackground, Linking, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'styled-components/native';
import { ChapterPressableMode, ChapterRef } from '@components/Chapter/Chapter.interfaces';
import DownloadManager, { DownloadStatus } from '@utils/DownloadManager';
import { GRADIENT_COLOR } from './MangaViewer.shared';
import pLimit from 'p-limit';
import * as FileSystem from 'expo-file-system';
import { Constants } from '@theme/core';
import { ChapterContext } from '@context/ChapterContext';
import useMountedEffect from '@hooks/useMountedEffect';
import CancelablePromise from '@utils/CancelablePromise';
import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import DownloadCollection from '@utils/DownloadCollection';
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

const limit = pLimit(5);

const MangaViewer: React.FC<MangaViewerProps> = (props) => {
  const {
    route: {
      params: { manga },
    },
    navigation,
    viewManga,
    userMangaInfo,
    source,
  } = props;
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
  const theme = useTheme();
  const collapsible = useCollapsibleHeader(options);
  const { ready, Fallback } = useLazyLoading();
  const loadingAnimation = useAnimatedLoading();
  const chaptersOnDisplayRef = React.useRef<Record<string, string>>({}).current;

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
    return () => {
      DownloadManager.clearRefs();
    };
  }, []);

  const [sorted, setSorted] = React.useState(() => (userMangaInfo?.chapters ?? []).sort(selectedSortOption));
  const [mode, setMode] = React.useState<ChapterPressableMode>('normal');
  const [selectAll, setSelectAll] = React.useState<boolean>(false);

  const rowRenderer: (
    type: string | number,
    data: ReadingChapterInfo & { mangaName: string; sourceName: string },
    index: number,
    extendedState?: object | undefined
  ) => JSX.Element | JSX.Element[] | null = React.useCallback(
    (type, data, i) => (
      <Chapter
        chapter={data}
        ref={(r) =>
          DownloadManager.setRef(
            data,
            FileSystem.documentDirectory +
              `Mangas/${manga.source}/${manga.title}/${sorted[i].name ?? `Chapter ${sorted[i].index}`}/`,
            source,
            r
          )
        }
      />
    ),
    [sorted]
  );

  React.useEffect(() => {
    if (mode === 'selection') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        setMode('normal');
        setSelectAll(false);
        return true;
      });
      return () => backHandler.remove();
    }
  }, [mode]);

  const handleOnSelectAll = React.useCallback((newVal: boolean) => {
    setSelectAll(newVal);
    setMode((prev) => {
      switch (prev) {
        case 'normal':
          return 'selection';
        case 'selection':
          return 'normal';
      }
    });
  }, []);

  useMountedEffect(() => {
    if (selectAll) {
      for (let i = 0; i < sorted.length; i++) {
        const chapterElement = DownloadManager.of(sorted[i]);
        if (chapterElement != null) {
          chapterElement.toggleCheck();
        }
      }
    }
  }, [selectAll]);

  const handleOnDownloadAll = React.useCallback(async () => {
    const collection = DownloadCollection.of(
      FileSystem.documentDirectory + `Mangas/${manga.source}/${manga.title}/`,
      sorted,
      source
    );
    if (collection.isIdle()) {
      collection.queueAll();
      await collection.downloadAll();
    } else if (collection.isDownloading()) {
      await collection.pauseAll();
    } else if (collection.isPaused()) {
      await collection.resumeAll();
    }
  }, [sorted, source]);

  React.useEffect(() => {
    const sort = Array.from(userMangaInfo?.chapters ?? []).sort(selectedSortOption);
    setSorted(sort);
    for (let i = 0; i < sort.length; i++) {
      chaptersOnDisplayRef[sort[i].link] = sort[i].link;
    }
  }, [userMangaInfo?.chapters, sort, reverse]);

  if (ready) {
    return (
      <React.Suspense
        fallback={
          <Flex grow alignItems='center' justifyContent='center'>
            <Progress />
          </Flex>
        }>
        <ChapterContext.Provider value={[mode, setMode]}>
          <AnimatedProvider style={loadingAnimation}>
            <Overview
              rowRenderer={rowRenderer}
              mangaName={`${manga.source}/${manga.title}`}
              sourceName={manga.source}
              loading={loading}
              onChangeLanguage={setLanguage}
              chapters={sorted}
              language={language}
              currentChapter={userMangaInfo?.currentlyReadingChapter}
              collapsible={collapsible}>
              <MangaViewerContainer>
                <ImageBackground source={{ uri: manga.imageCover }}>
                  <LinearGradient colors={['transparent', GRADIENT_COLOR.get()]}>
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
                <Genres buttons genres={userMangaInfo?.genres} source={source} />
              </MangaViewerContainer>
              <ChapterHeader
                selectAll={selectAll}
                onSelectAll={handleOnDownloadAll}
                onChangeLanguage={setLanguage}
                language={language}
                refresh={refresh}
                chapters={meta?.chapters}
                sort={sort}
                handleOnOpenModal={handleOnOpenModal}
                loading={loading}
              />
              <LanguageModal visible={visible} onCloseModal={handleOnCloseModal} sortOptions={sortOptions} />
            </Overview>
          </AnimatedProvider>
        </ChapterContext.Provider>
      </React.Suspense>
    );
  }
  return Fallback;
};

export default connector(MangaViewer);
