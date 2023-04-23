import { BadgeLocation } from '@components/Badge';
import React from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { moderateScale } from 'react-native-size-matters';

export function useBadgeLayoutAnimation(
  show: boolean,
  placement?: BadgeLocation,
) {
  const opacity = useSharedValue(show ? 1 : 0);
  React.useEffect(() => {
    if (show)
      opacity.value = withTiming(1, { duration: 100, easing: Easing.ease });
    else opacity.value = withTiming(0, { duration: 100, easing: Easing.ease });
  }, [show]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: opacity.value }],
  }));

  const style = React.useMemo(
    () => [animatedStyle, generateBadgePlacement(placement)],
    [placement],
  );

  return style;
}

const OFFSET = moderateScale(4);

export function generateBadgePlacement(placement?: BadgeLocation) {
  switch (placement) {
    case BadgeLocation.BOTTOM_LEFT:
      return {
        left: OFFSET,
        bottom: OFFSET,
      };
    case BadgeLocation.BOTTOM_RIGHT:
      return {
        right: OFFSET,
        bottom: OFFSET,
      };
    case BadgeLocation.TOP_LEFT:
      return {
        top: OFFSET,
        left: OFFSET,
      };
    default:
    case BadgeLocation.TOP_RIGHT:
      return {
        top: OFFSET,
        right: OFFSET,
      };
  }
}
