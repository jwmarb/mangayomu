import { renderItem, keyExtractor } from '@screens/Home/screens/MangaViewer/components/Overview/Overview.flat.list';
import { OverviewProps } from '@screens/Home/screens/MangaViewer/components/Overview/Overview.interfaces';
import React from 'react';
import { Animated } from 'react-native';

const Overview: React.FC<OverviewProps> = (props) => {
  const {
    children,
    chapters,
    collapsible: { onScroll, scrollIndicatorInsetTop, containerPaddingTop },
  } = props;

  return (
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
  );
};

export default Overview;
