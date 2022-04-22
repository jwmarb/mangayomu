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
} from '@components/core';
import useAPICall from '@hooks/useAPICall';

import React from 'react';
import { useCollapsibleHeader, UseCollapsibleOptions } from 'react-navigation-collapsible';
import MangaValidator from '@utils/MangaValidator';
import StatusIndicator from '@screens/Home/screens/MangaViewer/components/StatusIndicator';
import connector, { MangaViewerProps } from '@screens/Home/screens/MangaViewer/MangaViewer.redux';
import { MangaViewerContainer } from '@screens/Home/screens/MangaViewer/MangaViewer.base';
import useAnimatedLoading from '@hooks/useAnimatedLoading';
import { AnimatedProvider } from '@context/AnimatedContext';
import useLazyLoading from '@hooks/useLazyLoading';
import useSort from '@hooks/useSort';
import { MangaChapter, WithDate } from '@services/scraper/scraper.interfaces';
import { HeaderBuilder } from '@components/Screen/Header/Header.base';
const Genres = React.lazy(() => import('@screens/Home/screens/MangaViewer/components/Genres'));
const ChapterHeader = React.lazy(() => import('@screens/Home/screens/MangaViewer/components/ChapterHeader'));
const Title = React.lazy(() => import('@screens/Home/screens/MangaViewer/components/Title'));
const Description = React.lazy(() => import('@screens/Home/screens/MangaViewer/components/Description'));
const Authors = React.lazy(() => import('@screens/Home/screens/MangaViewer/components/Authors'));
const MangaCover = React.lazy(() => import('@screens/Home/screens/MangaViewer/components/MangaCover'));
const MangaAction = React.lazy(() => import('@screens/Home/screens/MangaViewer/components/MangaAction'));
const Overview = React.lazy(() => import('@screens/Home/screens/MangaViewer/components/Overview'));

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
  const options: UseCollapsibleOptions = React.useMemo(
    () => ({
      navigationOptions: {
        header: Header,
        headerRight: () => <IconButton icon={<Icon bundle='Feather' name='share-2' />} />,
        headerTitle: '',
      },
      config: {
        useNativeDriver: true,
      },
    }),
    [userMangaInfo?.inLibrary]
  );

  const { sort, visible, handleOnCloseModal, handleOnOpenModal, sortOptions, selectedSortOption } = useSort(
    (reversed) => ({
      Chapter: (a: MangaChapter, b: MangaChapter) => (a.name && b.name ? (reversed ? -1 : 1) * a.index - b.index : 0),
      ...(MangaValidator.hasDate(userMangaInfo?.chapters[0] ?? {})
        ? {
            'Date Released': (a: WithDate, b: WithDate) => Date.parse(a.date) - Date.parse(b.date),
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
    if (!loading && meta) {
      viewManga({ ...manga, ...meta });
    }
  }, [loading, meta]);

  const sorted = React.useMemo(
    () => userMangaInfo?.chapters.sort(selectedSortOption as any),
    [userMangaInfo?.chapters, selectedSortOption]
  );

  if (ready)
    return (
      <React.Suspense
        fallback={
          <Flex grow alignItems='center' justifyContent='center'>
            <Progress />
          </Flex>
        }>
        <AnimatedProvider style={loadingAnimation}>
          <Overview
            loading={loading}
            chapters={sorted}
            currentChapter={userMangaInfo?.currentlyReadingChapter}
            collapsible={collapsible}>
            <MangaViewerContainer>
              <Flex container horizontalPadding={3} verticalPadding={0}>
                <MangaCover mangaCoverURI={manga.imageCover} />
                <Spacer x={2} />
                <Flex direction='column' shrink>
                  <Title title={manga.title} isAdult={isAdult} />
                  <Authors manga={manga} loading={loading} authors={meta?.authors} />
                  <Spacer y={1} />
                  <Genres genres={meta?.genres} loading={loading} />
                  <Spacer y={1} />
                  <StatusIndicator meta={meta} loading={loading} />
                  <Spacer y={1} />
                  <MangaAction manga={manga} userMangaInfo={userMangaInfo} />
                </Flex>
              </Flex>

              <Spacer y={2} />
              <Description loading={loading} description={meta?.description} />
              <Spacer y={2} />
              <Genres buttons genres={meta?.genres} loading={loading} />
            </MangaViewerContainer>
            <ChapterHeader chapters={meta?.chapters} sort={sort} handleOnOpenModal={handleOnOpenModal} />
            <Modal visible={visible} onClose={handleOnCloseModal}>
              <HeaderBuilder paper removeStatusBarPadding horizontalPadding verticalPadding>
                <Typography variant='subheader'>Sort Chapters</Typography>
              </HeaderBuilder>
              {sortOptions}
            </Modal>
          </Overview>
        </AnimatedProvider>
      </React.Suspense>
    );
  return Fallback;
};

export default connector(MangaViewer);
