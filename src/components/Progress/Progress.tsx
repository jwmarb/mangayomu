import Flex from '@components/Flex';
import Icon from '@components/Icon';
import { ProgressCircle } from '@components/Progress/Progress.base';
import { ProgressProps } from '@components/Progress/Progress.interfaces';
import { Color } from '@theme/core';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { RFValue } from 'react-native-responsive-fontsize';

const Progress: React.FC<ProgressProps> = (props) => {
  const { color = 'primary', size = 'medium', native = false } = props;
  const numSize = React.useMemo(() => {
    switch (size) {
      default:
      case 'medium':
        return RFValue(20);
      case 'large':
        return RFValue(32);
      case 'small':
        return RFValue(14);
    }
  }, [size]);

  if (native) return <ActivityIndicator color={Color.valueOf(color)} size={numSize} />;
  const spin = useSharedValue(0);
  React.useEffect(() => {
    spin.value = withRepeat(withTiming(360, { duration: 2000, easing: Easing.linear }), -1);
    // return () => {
    //   cancelAnimation(spin);
    // };
  }, []);

  const animated = useAnimatedStyle(() => ({
    transform: [{ rotate: spin.value + 'deg' }],
    width: numSize,
    height: numSize,
  }));
  return (
    <Animated.View style={animated}>
      <Icon bundle='FontAwesome5' name='spinner' size={size} color={color} />
    </Animated.View>
  );
};

export default Progress;
