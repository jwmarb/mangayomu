import useAnimatedLoading from '@hooks/useAnimatedLoading';
import React from 'react';
import Animated from 'react-native-reanimated';

export default function withAnimatedLoading<T = any>(Component: React.FC<T>): React.FC<T> {
  return (props) => {
    const style = useAnimatedLoading();

    return (
      <Animated.View style={style}>
        <Component {...props} />
      </Animated.View>
    );
  };
}
