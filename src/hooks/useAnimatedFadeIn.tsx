import React from 'react';
import { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';

export default function useAnimatedFadeIn() {
  const opacity = useSharedValue(0.5);
  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000, easing: Easing.ease });
  }, []);
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return style;
}
