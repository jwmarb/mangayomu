import { useTheme } from '@emotion/react';
import useMountedEffect from '@hooks/useMountedEffect';
import { useNetInfo } from '@react-native-community/netinfo';
import {
  OVERLAY_HEADER_HEIGHT,
  READER_NETWORK_TOAST_HEIGHT,
} from '@theme/constants';
import React from 'react';
import {
  Easing,
  SharedValue,
  cancelAnimation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * A hook to use all necessities to provide functionality for network toast and components that depend on it
 */
export default function useNetworkToast(args: {
  overlayOpacity: SharedValue<number>;
}) {
  const { isInternetReachable } = useNetInfo();
  const { overlayOpacity } = args;
  const insets = useSafeAreaInsets();
  const derivedValue = useSharedValue(0);
  const toastOpacity = useSharedValue(0);
  const theme = useTheme();
  const translateY = useDerivedValue(() =>
    interpolate(
      toastOpacity.value,
      [0, 1],
      [-(insets.top + READER_NETWORK_TOAST_HEIGHT), 0],
    ),
  );
  const topOverlayAndToastDifference = useDerivedValue(() =>
    interpolate(toastOpacity.value, [0, 1], [0, READER_NETWORK_TOAST_HEIGHT]),
  );
  const topOverlayTranslateY = useDerivedValue(() =>
    interpolate(
      overlayOpacity.value,
      [0, 1],
      [-OVERLAY_HEADER_HEIGHT, topOverlayAndToastDifference.value],
    ),
  );
  const backgroundColor = useDerivedValue(() =>
    interpolateColor(
      derivedValue.value,
      [1, 0],
      [theme.palette.background.default, theme.palette.primary.main],
    ),
  );
  const toastStyle = useAnimatedStyle(() => ({
    opacity: toastOpacity.value,
    transform: [{ translateY: translateY.value }],
    backgroundColor: backgroundColor.value,
  }));
  const topOverlayStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: topOverlayTranslateY.value }],
    opacity: overlayOpacity.value,
  }));

  React.useEffect(() => {
    if (isInternetReachable) {
      derivedValue.value = withTiming(0, {
        duration: 150,
        easing: Easing.ease,
      });
      toastOpacity.value = withDelay(
        2000,
        withTiming(0, { duration: 150, easing: Easing.ease }),
      );
    } else {
      derivedValue.value = 1;
      toastOpacity.value = withTiming(1, {
        duration: 150,
        easing: Easing.ease,
      });
    }
    return () => {
      cancelAnimation(derivedValue);
      cancelAnimation(toastOpacity);
    };
  }, [isInternetReachable]);
  const memoizedToastStyle = React.useMemo(() => toastStyle, []);
  const memoizedTopOverlayStyle = React.useMemo(() => topOverlayStyle, []);
  return {
    toastStyle: memoizedToastStyle,
    topOverlayStyle: memoizedTopOverlayStyle,
  };
}
