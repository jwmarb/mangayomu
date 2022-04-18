import ButtonBase from '@components/Button/ButtonBase';
import { Icon } from '@components/core';
import { Typography } from '@components/Typography';
import {
  FloatingActionButton,
  FloatingActionButtonContainer,
  FloatingContainer,
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
        windowSize={7}
        ListHeaderComponent={<>{children}</>}
      />
    </>
  );
};

export default Overview;
