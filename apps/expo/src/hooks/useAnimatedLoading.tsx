import React, { useContext } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { AnimatedContext } from '@context/AnimatedContext';
import { useIsFocused } from '@react-navigation/native';

export default function useAnimatedLoading() {
  const providedStyle = useContext(AnimatedContext);
  if (providedStyle) return providedStyle;
  const opacity = useSharedValue(0.5);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.ease }),
        withTiming(0.5, { duration: 1000, easing: Easing.ease })
      ),
      -1
    );
    return () => {
      cancelAnimation(opacity);
    };
  }, [isFocused]);
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return style;
}
