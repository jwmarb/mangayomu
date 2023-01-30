import { useBadgeLayoutAnimation } from '@components/Badge/Badge.helpers';
import Box from '@components/Box';
import React from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ScaledSheet } from 'react-native-size-matters';
import { DotBadgeProps } from './Badge.interfaces';

const DotBadge: React.FC<DotBadgeProps> = (props) => {
  const { show, children, color = 'textPrimary' } = props;
  const style = useBadgeLayoutAnimation(show);

  const animatedStyle = React.useMemo(
    () => [style, styles.dot],
    [style, styles.dot],
  );

  return (
    <Box>
      {children}
      <Box as={Animated.View} style={animatedStyle} background-color={color} />
    </Box>
  );
};

const styles = ScaledSheet.create({
  dot: {
    position: 'absolute',
    top: '8@ms',
    right: '8@ms',
    width: '8@ms',
    height: '8@ms',
    borderRadius: 1000,
    borderColor: 'transparent',
  },
});

export default DotBadge;
