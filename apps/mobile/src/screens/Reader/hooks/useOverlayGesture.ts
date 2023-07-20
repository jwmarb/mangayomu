import useImmersiveMode from '@hooks/useImmersiveMode';
import React from 'react';
import { FlatList, Gesture, GestureType } from 'react-native-gesture-handler';
import {
  Easing,
  runOnJS,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/**
 * A hook that provides a gesture to interact with the reader overlay
 */
export default function useOverlayGesture(
  ref: React.MutableRefObject<GestureType | undefined>,
) {
  const overlayOpacity = useSharedValue(0);
  const velocityX = useSharedValue(0);

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
  const panGesture = React.useMemo(
    () =>
      Gesture.Pan()
        .onUpdate((e) => {
          velocityX.value = e.velocityX;
        })
        .withRef(ref),
    [],
  );
  return {
    tapGesture,
    hideOverlay,
    showOverlay,
    overlayOpacity,
    panGesture,
    velocityX,
  };
}
