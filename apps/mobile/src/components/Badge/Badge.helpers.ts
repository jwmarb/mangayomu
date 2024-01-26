import { BadgeLocation, BadgePlacementOffset } from '@components/Badge';
import React from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { moderateScale } from 'react-native-size-matters';

/**
 * A hook that provides the style prop for layout animations of a badge
 * @param show Whether to show the badge
 * @param placement The placement of the badge
 * @returns A style prop that uses animated values based on the parameters passed
 */
export function useBadgeLayoutAnimation(
  show: boolean,
  placement?: BadgeLocation,
  placementOffset?: BadgePlacementOffset,
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
    () => [animatedStyle, generateBadgePlacement(placement, placementOffset)],
    [placement],
  );

  return style;
}

const OFFSET = moderateScale(4);

export function generateBadgePlacement(
  placement?: BadgeLocation,
  placementOffset: BadgePlacementOffset = {},
) {
  const { t = 0, l = 0, r = 0, b = 0 } = placementOffset;
  switch (placement) {
    case BadgeLocation.BOTTOM_LEFT:
      return {
        left: OFFSET + l,
        bottom: OFFSET + b,
      };
    case BadgeLocation.BOTTOM_RIGHT:
      return {
        right: OFFSET + r,
        bottom: OFFSET + b,
      };
    case BadgeLocation.TOP_LEFT:
      return {
        top: OFFSET + t,
        left: OFFSET + l,
      };
    default:
    case BadgeLocation.TOP_RIGHT:
      return {
        top: OFFSET + t,
        right: OFFSET + r,
      };
  }
}
