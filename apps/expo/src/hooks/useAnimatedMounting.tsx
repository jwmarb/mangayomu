import React, { useContext } from 'react';
import { InteractionManager } from 'react-native';
import { useSharedValue, withSpring, withTiming, useAnimatedStyle, cancelAnimation } from 'react-native-reanimated';
import { AnimatedContext } from '@context/AnimatedContext';

export default function useAnimatedMounting(condition = true) {
  const opacity = useSharedValue(0);
  const transformY = useSharedValue(-10);
  React.useEffect(() => {
    if (condition) {
      opacity.value = withSpring(1);
      transformY.value = withTiming(0, { duration: 500 });
      return () => {
        cancelAnimation(opacity);
        cancelAnimation(transformY);
      };
    }
  }, [condition]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: transformY.value }],
  }));

  return style;
}
