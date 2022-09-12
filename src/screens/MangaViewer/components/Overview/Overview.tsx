import { ChapterRef } from '@components/Chapter/Chapter.interfaces';
import { Container } from '@components/Container';
import { Chapter } from '@components/core';
import { Typography } from '@components/Typography';
import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { AppState } from '@redux/store';
import FloatingActionButton from '@screens/MangaViewer/components/FloatingActionButton/FloatingActionButton';
import RecyclerListViewScrollView from '@screens/MangaViewer/components/Overview/components/RecyclerListViewScrollView';
import { OverviewProps } from '@screens/MangaViewer/components/Overview/Overview.interfaces';
import { createFooter } from '@screens/MangaViewer/components/Overview/Overview.recycler';
import { MangaMultilingualChapter } from '@services/scraper/scraper.interfaces';
import MangaValidator from '@utils/MangaValidator';
import React from 'react';
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
  LogBox,
  useWindowDimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import { WindowCorrection } from 'recyclerlistview/dist/reactnative/core/ViewabilityTracker';
const { height } = Dimensions.get('window');
import PropTypes from 'prop-types';
import { RFValue } from 'react-native-responsive-fontsize';
import useIsMounted from '@hooks/useIsMounted';
(RecyclerListView.propTypes as { externalScrollView: {} }).externalScrollView = PropTypes.object;

LogBox.ignoreLogs(['You have mounted RecyclerListView']);

const Overview: React.FC<React.PropsWithChildren<OverviewProps>> = (props) => {
  const { children, currentChapter, chapters, collapsible, rowRenderer, manga, dataProvider, loading, onRead } = props;
  const { containerPaddingTop } = collapsible;
  const [isAtBeginning, setIsAtBeginning] = React.useState<boolean>(true);
  const { width } = useWindowDimensions();
  const ref = React.useRef<RecyclerListView<any, any>>(null);
  const [finished, setFinished] = React.useState<boolean>(false);
  const deviceOrientation = useSelector((state: AppState) => state.settings.deviceOrientation);
  const chaptersList = useSelector((state: AppState) => state.chaptersList);
  const mangas = useSelector((state: AppState) => state.downloading.mangas);
  const chaptersInManga = useSelector((state: AppState) => state.mangas[manga.link]?.chapters ?? {});
  const metas = useSelector((state: AppState) => state.downloading.metas[manga.link]);
  const mangaOfChapters = useSelector((state: AppState) => state.mangas[manga.link]);

  const layout = React.useMemo(
    () =>
      new LayoutProvider(
        (index) => 0,
        (type, dim) => {
          (dim.height = RFValue(60)), (dim.width = width);
        }
      ),
    [width, deviceOrientation]
  );

  const [layoutHeight, setLayoutHeight] = React.useState<number>(height / 2);

  const listener = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      setIsAtBeginning(event.nativeEvent.contentOffset.y < height / 10);
    },
    [setIsAtBeginning, height]
  );

  const handleOnRecyclerListViewLayout = React.useCallback(() => {
    setFinished(true);
  }, [setFinished]);

  const handleOnLayout = React.useCallback(
    (e: LayoutChangeEvent) => {
      setLayoutHeight(e.nativeEvent.layout.height + containerPaddingTop);
    },
    [setLayoutHeight, containerPaddingTop]
  );
  const applyWindowCorrection: (offsetX: number, offsetY: number, windowCorrection: WindowCorrection) => void =
    React.useCallback(
      (offsetX, offsetY, windowCorrection) => {
        // console.log(offsetY);
        windowCorrection.startCorrection = -layoutHeight;
      },
      [layoutHeight, containerPaddingTop]
    );

  // React.useEffect(() => {
  //   setTimeout(() => ref.current?.forceRerender(), 0);
  // }, [width, deviceOrientation]);

  if (chapters == null) {
    return (
      <RecyclerListViewScrollView
        header={<View onLayout={handleOnLayout}>{children}</View>}
        listener={listener}
        collapsible={collapsible}
      />
    );
  }

  return (
    <>
      {dataProvider.getSize() > 0 && (
        <FloatingActionButton onRead={onRead} isAtBeginning={isAtBeginning} currentChapter={currentChapter} />
      )}
      <RecyclerListView
        externalScrollView={RecyclerListViewScrollView as any}
        scrollViewProps={{
          collapsible,
          listener,
          header: <View onLayout={handleOnLayout}>{children}</View>,
          onLayout: handleOnRecyclerListViewLayout,
        }}
        dataProvider={dataProvider}
        layoutProvider={layout}
        rowRenderer={rowRenderer}
        canChangeSize
        forceNonDeterministicRendering
        applyWindowCorrection={applyWindowCorrection}
        extendedState={{
          chaptersList,
          mangas,
          chaptersInManga,
          metas,
          deviceOrientation,
          width,
          manga: mangaOfChapters,
        }}
        renderFooter={createFooter(!finished, chapters.length)}
      />
    </>
  );
};

export default Overview;
