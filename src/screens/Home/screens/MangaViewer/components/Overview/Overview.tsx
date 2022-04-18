import ButtonBase from '@components/Button/ButtonBase';
import { Icon, Skeleton, Flex } from '@components/core';
import { AnimatedProvider } from '@context/AnimatedContext';
import useAnimatedLoading from '@hooks/useAnimatedLoading';
import {
  FloatingActionButton,
  FloatingActionButtonContainer,
  FloatingContainer,
  LoadingContainer,
} from '@screens/Home/screens/MangaViewer/components/Overview/Overview.base';
import { renderItem, keyExtractor } from '@screens/Home/screens/MangaViewer/components/Overview/Overview.flat.list';
import { OverviewProps } from '@screens/Home/screens/MangaViewer/components/Overview/Overview.interfaces';
import React from 'react';
import { Animated, View } from 'react-native';

const Overview: React.FC<OverviewProps> = (props) => {
  const {
    children,
    chapters,
    collapsible: { onScroll, scrollIndicatorInsetTop, containerPaddingTop },
  } = props;

  const loadingAnim = useAnimatedLoading();

  return (
    <>
      <FloatingContainer>
        <FloatingActionButtonContainer>
          <ButtonBase round onPress={() => {}} color='primary'>
            <FloatingActionButton>
              <Icon bundle='MaterialCommunityIcons' name='play' />
            </FloatingActionButton>
          </ButtonBase>
        </FloatingActionButtonContainer>
      </FloatingContainer>
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
