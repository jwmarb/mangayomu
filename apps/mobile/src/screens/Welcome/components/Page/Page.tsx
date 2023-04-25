import { PageProps } from './Page.interfaces';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

const Page: React.FC<PageProps> = ({ index, scrollPosition, children }) => {
  const { width } = useWindowDimensions();

  const opacity = useDerivedValue(
    () =>
      interpolate(
        scrollPosition.value,
        [width * (index - 1), width * index, width * (index + 1)],
        [0, 1, 0],
      ),
    [width],
  );

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  return <Animated.View style={style}>{children}</Animated.View>;
};

export default Page;
