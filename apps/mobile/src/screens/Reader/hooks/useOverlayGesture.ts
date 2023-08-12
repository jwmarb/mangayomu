import useAppSelector from '@hooks/useAppSelector';
import useImmersiveMode from '@hooks/useImmersiveMode';
import useMutableObject from '@hooks/useMutableObject';
import { useAppDispatch } from '@redux/main';
import { toggleIsFlashListActive } from '@redux/slices/reader';
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
  onFlashlistEnd: () => void;
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
  readingDirection: ReadingDirection;
}) {
  const { panRef, pinchRef, readingDirection } = args;
  const overlayOpacity = useSharedValue(0);
  const currentPageKey = useAppSelector((state) => state.reader.currentPage);
  const dispatch = useAppDispatch();
  const toggleFlashList = React.useCallback(
    (val: boolean) => dispatch(toggleIsFlashListActive(val)),
    [dispatch],
  );
  const pageKey = useMutableObject(currentPageKey);

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
        .cancelsTouchesInView(false)
        .maxDistance(0),
    [],
  );
  const doubleTapGesture = React.useMemo(
    () =>
      Gesture.Tap()
        .numberOfTaps(2)
        .onStart((e) => {
          if (readingDirection !== ReadingDirection.WEBTOON)
            runOnJS(passToUI)('onDoubleTap', e);
        })
        .maxDelay(150),
    [readingDirection !== ReadingDirection.WEBTOON],
  );

  function passToUI<T extends keyof PageGestureEventHandlers>(
    key: T,
    e: Parameters<PageGestureEventHandlers[T]>[0],
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (pageKey.current != null && pageKey.current in pageGestures.current)
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
    [readingDirection !== ReadingDirection.WEBTOON],
  );

  const handleOnEnd = () => {
    if (pageKey.current != null && pageKey.current in pageGestures.current)
      pageGestures.current[pageKey.current].onFlashlistEnd();
  };

  const nativeFlatListGesture = React.useMemo(
    () =>
      Gesture.Native()
        .onStart(() => {
          runOnJS(toggleFlashList)(true);
        })
        .onEnd(() => {
          runOnJS(toggleFlashList)(false);
          console.log('END');
          if (readingDirection !== ReadingDirection.WEBTOON)
            runOnJS(handleOnEnd)();
        }),
    [pinchGesture, readingDirection !== ReadingDirection.WEBTOON],
  );
  return {
    tapGesture,
    hideOverlay,
    showOverlay,
    overlayOpacity,
    pinchGesture,
    pageGestures,
    nativeFlatListGesture,
    doubleTapGesture,
  };
}
