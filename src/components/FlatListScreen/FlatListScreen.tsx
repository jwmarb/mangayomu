import { FlatListScreenProps } from '@components/FlatListScreen/FlatListScreen.interfaces';
import React from 'react';
import { Animated } from 'react-native';
import { useTheme } from 'styled-components/native';

function FlatListScreen<T>(props: FlatListScreenProps<T>) {
  const {
    collapsible: { onScroll, containerPaddingTop, scrollIndicatorInsetTop },
    ...rest
  } = props;
  const theme = useTheme();
  return (
    <Animated.FlatList
      onScroll={onScroll}
      contentContainerStyle={{
        paddingTop: containerPaddingTop,
        flexGrow: 1,
        backgroundColor: theme.palette.background.default.get(),
      }}
      scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
      {...(rest as any)}
    />
  );
}

export default FlatListScreen;
