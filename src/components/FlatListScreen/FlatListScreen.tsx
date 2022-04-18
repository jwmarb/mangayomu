import { FlatListScreenProps } from '@components/FlatListScreen/FlatListScreen.interfaces';
import pixelToNumber from '@utils/pixelToNumber';
import React from 'react';
import { Animated } from 'react-native';
import { useTheme } from 'styled-components/native';

function FlatListScreen<T>(props: FlatListScreenProps<T>) {
  const {
    collapsible: { onScroll, containerPaddingTop, scrollIndicatorInsetTop },
    padding,
    contentContainerStyle,
    ...rest
  } = props;
  const theme = useTheme();
  return (
    <Animated.FlatList
      onScroll={onScroll}
      contentContainerStyle={[
        {
          flexGrow: 1,
          backgroundColor: theme.palette.background.default.get(),
        },
        padding
          ? {
              paddingLeft: pixelToNumber(theme.spacing(3)),
              paddingRight: pixelToNumber(theme.spacing(3)),
              paddingBottom: pixelToNumber(theme.spacing(3)),
              paddingTop: containerPaddingTop + pixelToNumber(theme.spacing(3)),
            }
          : {
              paddingTop: containerPaddingTop,
            },
        contentContainerStyle,
      ]}
      scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
      {...(rest as any)}
    />
  );
}

export default FlatListScreen;
