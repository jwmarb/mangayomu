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

  const tapGesture = React.useMemo(
    () =>
      Gesture.Tap()
        .onStart(() => {
          if (overlayOpacity.value > 0) {
            runOnJS(hideStatusAndNavBar)();
            overlayOpacity.value = withTiming(0, {
              duration: 150,
              easing: Easing.ease,
            });
          } else {
            runOnJS(showStatusAndNavBar)();
            overlayOpacity.value = withTiming(1, {
              duration: 150,
              easing: Easing.ease,
            });
          }
        })
        .cancelsTouchesInView(false),
    [],
  );
  return tapGesture;
}
