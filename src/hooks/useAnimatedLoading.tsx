import React, { useContext } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { AnimatedContext } from 'src/context/AnimatedContext';

export default function useAnimatedLoading() {
  const providedStyle = useContext(AnimatedContext);
  if (providedStyle) return providedStyle;
  const opacity = useSharedValue(0.5);
  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.ease }),
        withTiming(0.5, { duration: 1000, easing: Easing.ease })
      ),
      -1
    );
  }, []);
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return style;
}
