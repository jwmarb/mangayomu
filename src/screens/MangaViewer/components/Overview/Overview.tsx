import { Container } from '@components/Container';
import { Typography } from '@components/Typography';
import FloatingActionButton from '@screens/MangaViewer/components/FloatingActionButton/FloatingActionButton';
import RecyclerListViewScrollView from '@screens/MangaViewer/components/Overview/components/RecyclerListViewScrollView';
import { OverviewProps } from '@screens/MangaViewer/components/Overview/Overview.interfaces';
import { createFooter, layout, rowRenderer } from '@screens/MangaViewer/components/Overview/Overview.recycler';
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
} from 'react-native';
import { DataProvider, RecyclerListView } from 'recyclerlistview';
import { WindowCorrection } from 'recyclerlistview/dist/reactnative/core/ViewabilityTracker';
const { height } = Dimensions.get('window');

LogBox.ignoreLogs(['You have mounted RecyclerListView']);

const Overview: React.FC<OverviewProps> = (props) => {
  const {
    children,
    chapters,
    currentChapter,
    collapsible,
    language,
    onChangeLanguage,
    loading,
    mangaName,
    sourceName,
  } = props;
  const { containerPaddingTop } = collapsible;

  const [isAtBeginning, setIsAtBeginning] = React.useState<boolean>(false);
  const [finished, setFinished] = React.useState<boolean>(false);
  const [dataProvider, setDataProvider] = React.useState<DataProvider>(new DataProvider((r1, r2) => r1 !== r2));
  React.useEffect(() => {
    if (chapters && chapters.every(MangaValidator.isMultilingualChapter))
      onChangeLanguage((chapters as unknown as MangaMultilingualChapter[])[0]?.language ?? 'en');
  }, [chapters]);
  React.useEffect(() => {
    if (chapters && chapters.every(MangaValidator.isMultilingualChapter)) {
      setDataProvider((p) =>
        p.cloneWithRows(
          chapters
            .filter((x: unknown) => (x as MangaMultilingualChapter).language === language)
            .map((p) => ({ ...p, mangaName, sourceName }))
        )
      );
    } else if (chapters)
      setDataProvider((p) => p.cloneWithRows(chapters.map((p) => ({ ...p, mangaName, sourceName }))));
  }, [chapters, language]);
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
        windowCorrection.windowShift = -layoutHeight;
      },
      [layoutHeight, containerPaddingTop]
    );

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
        <FloatingActionButton isAtBeginning={isAtBeginning} currentChapter={currentChapter} />
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
        applyWindowCorrection={applyWindowCorrection}
        forceNonDeterministicRendering
        disableRecycling
        renderFooter={createFooter(!finished, chapters.length)}
      />
    </>
  );
};

export default Overview;
