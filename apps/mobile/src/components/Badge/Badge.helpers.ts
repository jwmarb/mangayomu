import React from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export function useBadgeLayoutAnimation(show?: boolean) {
  const opacity = useSharedValue(show ? 1 : 0);
  React.useEffect(() => {
    if (show)
      opacity.value = withTiming(1, { duration: 100, easing: Easing.ease });
    else opacity.value = withTiming(0, { duration: 100, easing: Easing.ease });
  }, [show]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: opacity.value }],
  }));

  return style;
}
