import Flex from '@components/Flex';
import { BarBackground, BarIndicator, BarContainer } from '@components/Progress/Progress.base';
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  cancelAnimation,
  useAnimatedStyle,
} from 'react-native-reanimated';
import React from 'react';
import { BarProps } from './Progress.interfaces';
import { useWindowDimensions } from 'react-native';

const Bar: React.FC<BarProps> = (props) => {
  const {} = props;
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(-width);

  React.useEffect(() => {
    translateX.value = withRepeat(
      withSequence(withTiming(width, { duration: 1500, easing: Easing.linear }), withTiming(-width, { duration: 0 })),
      -1
    );
    return () => {
      cancelAnimation(translateX);
    };
  }, []);

  const barStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <BarContainer>
      <BarIndicator style={barStyle} />
      <BarBackground />
    </BarContainer>
  );
};

export default Bar;
