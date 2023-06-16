import useImmersiveMode from '@hooks/useImmersiveMode';
import React from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  Easing,
  SharedValue,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';

/**
 * A hook that provides a gesture to interact with the reader overlay
 */
export default function useOverlayGesture(args: {
  overlayOpacity: SharedValue<number>;
}) {
  const { overlayOpacity } = args;
  const [showStatusAndNavBar, hideStatusAndNavBar] = useImmersiveMode();

  function showOverlay() {
    'worklet';
    runOnJS(showStatusAndNavBar)();
    overlayOpacity.value = withTiming(1, {
      duration: 150,
      easing: Easing.ease,
    });
  }

  function hideOverlay() {
    'worklet';
    runOnJS(hideStatusAndNavBar)();
    overlayOpacity.value = withTiming(0, {
      duration: 150,
      easing: Easing.ease,
    });
  }

  const tapGesture = React.useMemo(
    () =>
      Gesture.Tap()
        .onStart(() => {
          if (overlayOpacity.value > 0) hideOverlay();
          else showOverlay();
        })
        .cancelsTouchesInView(false),
    [],
  );
  return { tapGesture, hideOverlay, showOverlay };
}
