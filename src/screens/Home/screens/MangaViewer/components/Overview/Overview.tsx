import FloatingActionButton from '@screens/Home/screens/MangaViewer/components/FloatingActionButton/FloatingActionButton';
import RecyclerListViewScrollView from '@screens/Home/screens/MangaViewer/components/Overview/components/RecyclerListViewScrollView';
import { OverviewProps } from '@screens/Home/screens/MangaViewer/components/Overview/Overview.interfaces';
import {
  createFooter,
  layout,
  rowRenderer,
} from '@screens/Home/screens/MangaViewer/components/Overview/Overview.recycler';
import React from 'react';
import { Dimensions, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';
import { DataProvider, RecyclerListView } from 'recyclerlistview';
import { WindowCorrection } from 'recyclerlistview/dist/reactnative/core/ViewabilityTracker';
const { height } = Dimensions.get('window');

const Overview: React.FC<OverviewProps> = (props) => {
  const { children, chapters, currentChapter, loading, collapsible } = props;
  const { containerPaddingTop } = collapsible;

  const [isAtBeginning, setIsAtBeginning] = React.useState<boolean>(false);
  const [finished, setFinished] = React.useState<boolean>(false);
  const [dataProvider, setDataProvider] = React.useState<DataProvider>(new DataProvider((r1, r2) => r1 !== r2));
  React.useEffect(() => {
    if (chapters) setDataProvider(new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(chapters));
  }, [chapters]);
  const [layoutHeight, setLayoutHeight] = React.useState<number>(0);

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

  return (
    <>
      <FloatingActionButton isAtBeginning={isAtBeginning} currentChapter={currentChapter} />
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
        renderFooter={createFooter(!finished)}
      />
    </>
  );
};

export default Overview;
