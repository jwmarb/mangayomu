import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';
import Animated from 'react-native-reanimated';
import useTheme from '@/hooks/useTheme';

function Progress(
  props: ActivityIndicatorProps,
  ref: React.ForwardedRef<ActivityIndicator>,
) {
  const theme = useTheme();
  return (
    <ActivityIndicator
      {...props}
      ref={ref}
      color={theme.palette.primary.main}
    />
  );
}

const ProgressComponent = React.forwardRef(Progress);

export const AnimatedProgress =
  Animated.createAnimatedComponent(ProgressComponent);

export default ProgressComponent;
