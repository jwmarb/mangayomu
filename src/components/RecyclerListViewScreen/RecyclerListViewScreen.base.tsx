import Flex from '@components/Flex';
import { RecyclerListViewScreenProps } from '@components/RecyclerListViewScreen/RecyclerListViewScreen.interfaces';
import React from 'react';
import { Animated, ScrollViewProps } from 'react-native';

export const ScrollViewWithCollapsible: React.FC<ScrollViewProps & RecyclerListViewScreenProps> = React.forwardRef(
  (props, ref) => {
    const {
      onScroll: regularScrollHandler = () => void 0,
      contentContainerStyle = {},
      collapsible: { containerPaddingTop, scrollIndicatorInsetTop, onScrollWithListener },
      listener = () => void 0,
      children,
      ...rest
    } = props;
    const onScroll = onScrollWithListener((e) => {
      regularScrollHandler(e);
      listener(e);
    });
    return (
      <Animated.ScrollView
        contentContainerStyle={[{ paddingTop: containerPaddingTop }, contentContainerStyle]}
        scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
        onScroll={onScroll}
        ref={ref}
        {...rest}>
        {children}
      </Animated.ScrollView>
    );
  }
);
