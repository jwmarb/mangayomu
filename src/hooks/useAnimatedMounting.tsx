import React from 'react';
import { useSharedValue, withSpring, withTiming, useAnimatedStyle } from 'react-native-reanimated';

export default function useAnimatedMounting(condition: boolean = true) {
  const opacity = useSharedValue(0);
  const transformY = useSharedValue(-10);
  React.useEffect(() => {
    if (condition) {
      opacity.value = withSpring(1);
      transformY.value = withTiming(0, { duration: 500 });
    }
  }, [condition]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: transformY.value }],
  }));

  return style;
}
