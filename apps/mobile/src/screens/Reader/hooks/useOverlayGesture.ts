import useImmersiveMode from '@hooks/useImmersiveMode';
import { ReadingDirection } from '@redux/slices/settings';
import React from 'react';
import {
  Gesture,
  GestureType,
  GestureUpdateEvent,
  PinchGestureHandlerEventPayload,
  PinchGestureChangeEventPayload,
  TapGestureHandlerEventPayload,
  GestureStateChangeEvent,
} from 'react-native-gesture-handler';
import {
  Easing,
  runOnJS,
  runOnUI,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export type PageGestureEventHandlers = {
  onPinchChange: (
    e: GestureUpdateEvent<
      PinchGestureHandlerEventPayload & PinchGestureChangeEventPayload
    >,
  ) => void;
  onDoubleTap: (
    e: GestureStateChangeEvent<TapGestureHandlerEventPayload>,
  ) => void;
  onFlashlistActive: () => void;
};

export type PageGestures = React.MutableRefObject<
  Record<string, PageGestureEventHandlers>
>;
/**
 * A hook that provides a gesture to interact with the reader overlay
 */
export default function useOverlayGesture(args: {
  panRef: React.MutableRefObject<GestureType | undefined>;
  pinchRef: React.MutableRefObject<GestureType | undefined>;
  pageKey: React.MutableRefObject<string>;
  readingDirection: ReadingDirection;
}) {
  const { panRef, pageKey, pinchRef, readingDirection } = args;
  const overlayOpacity = useSharedValue(0);
  const velocityX = useSharedValue(0);

  const [showStatusAndNavBar, hideStatusAndNavBar] = useImmersiveMode();
  const pageGestures = React.useRef<Record<string, PageGestureEventHandlers>>(
    {},
  );

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
  const doubleTapGesture = React.useMemo(
    () =>
      Gesture.Tap()
        .numberOfTaps(2)
        .onStart((e) => {
          runOnJS(passToUI)('onDoubleTap', e);
        })
        .maxDelay(200),
    [],
  );
  const panGesture = React.useMemo(
    () =>
      Gesture.Pan()
        .onUpdate((e) => {
          velocityX.value = e.velocityX;
        })
        .withRef(panRef),
    [],
  );
  function passToUI<T extends keyof PageGestureEventHandlers>(
    key: T,
    e: Parameters<PageGestureEventHandlers[T]>[0],
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    runOnUI((pageGestures.current[pageKey.current] as any)[key])(e);
  }

  const pinchGesture = React.useMemo(
    () =>
      Gesture.Pinch()
        .onChange((e) => {
          if (readingDirection !== ReadingDirection.WEBTOON)
            runOnJS(passToUI)('onPinchChange', e);
        })
        .withRef(pinchRef),
    [readingDirection],
  );
  return {
    tapGesture,
    hideOverlay,
    showOverlay,
    overlayOpacity,
    panGesture,
    velocityX,
    pinchGesture,
    pageGestures,
    doubleTapGesture,
  };
}
