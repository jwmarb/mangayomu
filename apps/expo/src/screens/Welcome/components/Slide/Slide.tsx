import React from 'react';
import { InteractionManager } from 'react-native';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SlideProps } from './Slide.interfaces';

const Slide: React.FC<SlideProps> = ({ children }) => {
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withSpring(1);
    return () => {
      cancelAnimation(opacity);
    };
  }, []);

  const styles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  return <Animated.View style={styles}>{children}</Animated.View>;
};

export default Slide;
