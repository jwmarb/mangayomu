import { Skeleton, Chapter, Spacer } from '@components/core';
import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import RecyclerListViewScrollView from '@screens/Home/screens/MangaViewer/components/Overview/components/RecyclerListViewScrollView';
import { LoadingContainer } from '@screens/Home/screens/MangaViewer/components/Overview/Overview.base';
import { OverviewProps } from '@screens/Home/screens/MangaViewer/components/Overview/Overview.interfaces';
import animate from '@utils/animate';
import withAnimatedLoading from '@utils/withAnimatedLoading';
import React from 'react';
import { Dimensions, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import { WindowCorrection } from 'recyclerlistview/dist/reactnative/core/ViewabilityTracker';

const getItemLayout: (
  data: ReadingChapterInfo[] | null | undefined,
  index: number
) => {
  length: number;
  offset: number;
  index: number;
} = (data, index) => ({
  length: 70.0952377319336,
  offset: 70.0952377319336 * index,
  index,
});

const layout = new LayoutProvider(
  (index) => 0,
  (type, dim) => {
    (dim.height = 70.0952377319336), (dim.width = Dimensions.get('window').width);
  }
);

const rowRenderer: (
  type: string | number,
  data: any,
  index: number,
  extendedState?: object | undefined
) => JSX.Element | JSX.Element[] | null = (type, data) => <Chapter chapter={data} />;

const createFooter = (loading: boolean) => () =>
  loading ? (
    animate(
      <LoadingContainer>
        <Skeleton.Chapter />
        <Skeleton.Chapter />
        <Skeleton.Chapter />
      </LoadingContainer>,
      withAnimatedLoading
    )
  ) : (
    <Spacer y={16} /> // extra padding for UX reasons
  );

const Overview: React.FC<OverviewProps> = (props) => {
  const { children, chapters, currentChapter, loading, collapsible } = props;
  const { containerPaddingTop } = collapsible;

  const [isAtBeginning, setIsAtBeginning] = React.useState<boolean>(false);
  const dataProvider = React.useRef<DataProvider>(
    new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(chapters)
  ).current;
  const [layoutHeight, setLayoutHeight] = React.useState<number>(0);

  const listener = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      setIsAtBeginning(event.nativeEvent.contentOffset.y < 200);
    },
    [setIsAtBeginning]
  );

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
    <RecyclerListView
      externalScrollView={RecyclerListViewScrollView as any}
      scrollViewProps={{
        collapsible,
        listener,
        header: (
          <>
            {/* <FloatingActionButton isAtBeginning={isAtBeginning} currentChapter={currentChapter} /> */}
            <View onLayout={handleOnLayout}>{children}</View>
          </>
        ),
      }}
      dataProvider={dataProvider}
      layoutProvider={layout}
      rowRenderer={rowRenderer}
      applyWindowCorrection={applyWindowCorrection}
      renderFooter={createFooter(loading)}
    />
  );

  // return (
  //   <>
  //     {/* <FloatingActionButton currentChapter={currentChapter} isAtBeginning={isAtBeginning} /> */}
  //     <Animated.FlatList
  //       keyExtractor={keyExtractor}
  //       scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
  //       contentContainerStyle={{ paddingTop: containerPaddingTop }}
  //       onScroll={onScroll}
  //       renderItem={renderItem}
  //       getItemLayout={getItemLayout}
  //       data={chapters}
  //       initialNumToRender={8}
  //       maxToRenderPerBatch={12}
  //       ListEmptyComponent={
  //         <AnimatedProvider style={loadingAnim}>
  //           <LoadingContainer>
  //             <Skeleton.Chapter />
  //             <Skeleton.Chapter />
  //             <Skeleton.Chapter />
  //           </LoadingContainer>
  //         </AnimatedProvider>
  //       }
  //       windowSize={7}
  //       ListHeaderComponent={<>{children}</>}
  //     />
  //   </>
  // );
};

export default Overview;
