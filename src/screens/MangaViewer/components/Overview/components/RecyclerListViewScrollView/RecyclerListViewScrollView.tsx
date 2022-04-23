import { RecyclerListViewScrollViewProps } from '@screens/MangaViewer/components/Overview/components/RecyclerListViewScrollView/RecyclerListViewScrollView.interfaces';
import React from 'react';
import { Animated } from 'react-native';

const RecyclerListViewScrollView: React.FC<RecyclerListViewScrollViewProps> = React.forwardRef((props, ref) => {
  const {
    children,
    collapsible: { containerPaddingTop, scrollIndicatorInsetTop, onScrollWithListener },
    header,
    listener,
    onScroll: extended = () => void 0,
    ...rest
  } = props;
  const onScroll = onScrollWithListener((e) => {
    extended(e);
    listener(e);
  });
  return (
    <Animated.ScrollView
      ref={ref as any}
      contentContainerStyle={{ paddingTop: containerPaddingTop }}
      scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
      onScroll={onScroll}
      {...rest}>
      {header}
      {children}
    </Animated.ScrollView>
  );
});

export default RecyclerListViewScrollView;
