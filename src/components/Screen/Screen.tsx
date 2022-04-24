import { ScreenProps } from '@components/Screen/Screen.interfaces';
import { Screen as View, ScrollableScreen, AnimatedScrollableScreen } from './Screen.base';
import React from 'react';
import { useCollapsibleHeader } from 'react-navigation-collapsible';

const Screen: React.FC<ScreenProps> = (props) => {
  const { scrollable = false, collapsible, ...rest } = props;
  if (scrollable)
    if (scrollable === true)
      return (
        <ScrollableScreen>
          <View {...rest} />
        </ScrollableScreen>
      );
    else if (!collapsible) {
      const { onScroll, containerPaddingTop, scrollIndicatorInsetTop } = useCollapsibleHeader(scrollable);
      return (
        <AnimatedScrollableScreen
          onScroll={onScroll}
          contentContainerStyle={{ paddingTop: containerPaddingTop }}
          scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}>
          <View {...rest} />
        </AnimatedScrollableScreen>
      );
    } else {
      const { onScroll, containerPaddingTop, scrollIndicatorInsetTop } = collapsible;
      return (
        <AnimatedScrollableScreen
          onScroll={onScroll}
          contentContainerStyle={{ paddingTop: containerPaddingTop }}
          scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}>
          <View {...rest} />
        </AnimatedScrollableScreen>
      );
    }

  return <View {...rest} />;
};

export default Screen;
