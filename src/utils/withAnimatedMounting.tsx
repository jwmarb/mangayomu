import useAnimatedMounting from '@hooks/useAnimatedMounting';
import React from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

export default function withAnimatedMounting<T = any>(Component: React.FC<T>): React.FC<T> {
  return (props) => {
    const style = useAnimatedMounting();

    return (
      <Animated.View style={style}>
        <Component {...props} />
      </Animated.View>
    );
  };
}
