import React from 'react';
import { ProgressDotProps } from './ProgressDot.interfaces';
import { cancelAnimation, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ProgressDotBase } from './ProgressDot.base';

const ProgressDot: React.FC<ProgressDotProps> = (props) => {
  const { selected } = props;
  const scale = useSharedValue(0.8);
  React.useEffect(() => {
    if (selected) scale.value = withSpring(1);
    else scale.value = withSpring(0.9);
    return () => {
      cancelAnimation(scale);
    };
  }, [selected]);

  const styles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return <ProgressDotBase style={styles} selected={selected} />;
};

export default React.memo(ProgressDot);
