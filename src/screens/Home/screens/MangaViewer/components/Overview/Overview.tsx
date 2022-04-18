import ButtonBase from '@components/Button/ButtonBase';
import { Icon, Skeleton, Flex } from '@components/core';
import { AnimatedProvider } from '@context/AnimatedContext';
import useAnimatedLoading from '@hooks/useAnimatedLoading';
import { LoadingContainer } from '@screens/Home/screens/MangaViewer/components/Overview/Overview.base';
import { renderItem, keyExtractor } from '@screens/Home/screens/MangaViewer/components/Overview/Overview.flat.list';
import { OverviewProps } from '@screens/Home/screens/MangaViewer/components/Overview/Overview.interfaces';
import React from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';
import FloatingActionButton from '../FloatingActionButton/FloatingActionButton';

const Overview: React.FC<OverviewProps> = (props) => {
  const {
    children,
    chapters,
    collapsible: { scrollIndicatorInsetTop, containerPaddingTop, onScrollWithListener },
  } = props;

  const loadingAnim = useAnimatedLoading();
  const [isAtBeginning, setIsAtBeginning] = React.useState<boolean>(false);

  const listener = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      setIsAtBeginning(event.nativeEvent.contentOffset.y > 200);
    },
    [setIsAtBeginning]
  );

  const onScroll = onScrollWithListener(listener);

  return (
    <>
      <FloatingActionButton isAtBeginning={isAtBeginning} />
      <Animated.FlatList
        keyExtractor={keyExtractor}
        scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
        contentContainerStyle={{ paddingTop: containerPaddingTop }}
        onScroll={onScroll}
        renderItem={renderItem}
        data={chapters}
        initialNumToRender={8}
        maxToRenderPerBatch={20}
        ListEmptyComponent={
          <AnimatedProvider style={loadingAnim}>
            <LoadingContainer>
              <Skeleton.Chapter />
              <Skeleton.Chapter />
              <Skeleton.Chapter />
            </LoadingContainer>
          </AnimatedProvider>
        }
        windowSize={7}
        ListHeaderComponent={<>{children}</>}
      />
    </>
  );
};

export default Overview;
