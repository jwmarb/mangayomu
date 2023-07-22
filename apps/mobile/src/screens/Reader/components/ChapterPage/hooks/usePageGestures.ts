import useBoolean from '@hooks/useBoolean';
import useMutableObject from '@hooks/useMutableObject';
import useScreenDimensions from '@hooks/useScreenDimensions';
import { useAppDispatch } from '@redux/main';
import { toggleImageModal } from '@redux/slices/reader';
import { useChapterPageContext } from '@screens/Reader/components/ChapterPage/context/ChapterPageContext';
import React from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  Easing,
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';

interface UsePageGesturesArgs {
  pageKey: string;
  pinchScale: SharedValue<number>;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  stylizedHeight: number;
}

export default function usePageGestures(args: UsePageGesturesArgs) {
  const { pageKey, pinchScale, translateX, translateY, stylizedHeight } = args;
  const [enablePan, togglePan] = useBoolean();
  const mutablePageKey = useMutableObject(pageKey);
  const { height: screenHeight, width: screenWidth } = useScreenDimensions();
  const height = useMutableObject(screenHeight);
  const width = useMutableObject(screenWidth);
  const {
    imageMenuRef,
    velocityX,
    rootPanGesture,
    pageGestures,
    rootPinchGesture,
  } = useChapterPageContext();
  const maxTranslateX = useSharedValue(0);
  const maxTranslateY = useSharedValue(0);
  const dispatch = useAppDispatch();
  const toggle = React.useCallback(
    () => dispatch(toggleImageModal()),
    [toggleImageModal, dispatch],
  );
  const openMenu = () => {
    if (imageMenuRef.current != null)
      imageMenuRef.current.setImageMenuPageKey(mutablePageKey.current);
  };
  const holdGesture = React.useMemo(
    () =>
      Gesture.LongPress().onStart(() => {
        runOnJS(openMenu)();
        runOnJS(toggle)();
      }),
    [toggle],
  );

  React.useEffect(() => {
    pageGestures.current[pageKey] = {
      onPinchChange(e) {
        'worklet';
        pinchScale.value = Math.max(pinchScale.value + e.scaleChange - 1, 1);
        maxTranslateX.value =
          width.current / 2 - width.current / (pinchScale.value * 2);
        maxTranslateY.value = Math.max(
          0,
          stylizedHeight / 2 - height.current / (pinchScale.value * 2),
        );
      },
      onDoubleTap(e) {
        'worklet';
        if (pinchScale.value > 1) {
          pinchScale.value = withTiming(1, {
            duration: 200,
            easing: Easing.ease,
          });
          translateX.value = withTiming(0, {
            duration: 200,
            easing: Easing.ease,
          });
          translateY.value = withTiming(0, {
            duration: 200,
            easing: Easing.ease,
          });
        } else {
          const config = { duration: 200, easing: Easing.ease };
          const scaleValue = 3;
          pinchScale.value = withTiming(scaleValue, config);
          const calculatedMaxTranslateY = Math.max(
            0,
            stylizedHeight / 2 - height.current / (scaleValue * 2),
          );
          const calculatedMaxTranslateX =
            width.current / 2 - width.current / (scaleValue * 2);
          maxTranslateX.value = withTiming(calculatedMaxTranslateX, config);
          maxTranslateY.value = withTiming(calculatedMaxTranslateY, config);
          translateX.value = withTiming(
            Math.min(
              Math.max(-calculatedMaxTranslateX, width.current / 2 - e.x),
              calculatedMaxTranslateX,
            ),
            config,
          );
          translateY.value = withTiming(
            Math.min(
              calculatedMaxTranslateY,
              Math.max(-calculatedMaxTranslateY, height.current / 2 - e.y),
            ),
            config,
          );
        }
      },
    };
  }, []);

  useAnimatedReaction(
    () => pinchScale.value,
    (result) => {
      runOnJS(togglePan)(result > 1);
    },
  );

  const panGesture = React.useMemo(
    () =>
      Gesture.Pan()
        .enableTrackpadTwoFingerGesture(true)
        .onChange((e) => {
          translateX.value = Math.max(
            Math.min(
              maxTranslateX.value,
              e.changeX / pinchScale.value + translateX.value,
            ),
            -maxTranslateX.value,
          );
          translateY.value = Math.max(
            Math.min(
              maxTranslateY.value,
              translateY.value + e.changeY / pinchScale.value,
            ),
            -maxTranslateY.value,
          );

          if (maxTranslateX.value === 0) {
            translateX.value = withTiming(0, {
              duration: 150,
              easing: Easing.ease,
            });
            translateY.value = withTiming(0, {
              duration: 150,
              easing: Easing.ease,
            });
            runOnJS(togglePan)(false);
          }
        })
        .onEnd((e) => {
          translateX.value = withDecay({
            velocity: e.velocityX,
            velocityFactor: 0.3,

            clamp: [-maxTranslateX.value, maxTranslateX.value],
          });
          translateY.value = withDecay({
            velocity: e.velocityY,
            velocityFactor: 0.3,
            clamp: [-maxTranslateY.value, maxTranslateY.value],
          });
        })
        .onTouchesUp(() => {
          if (
            maxTranslateX.value === Math.abs(translateX.value) &&
            ((translateX.value < 0 && velocityX.value < -500) ||
              (translateX.value > 0 && velocityX.value > 500))
          )
            runOnJS(togglePan)(false);
        })
        .simultaneousWithExternalGesture(rootPanGesture, rootPinchGesture)
        .enabled(enablePan),
    [enablePan],
  );
  useAnimatedReaction(
    () => velocityX.value,
    (res) => {
      if (maxTranslateX.value === Math.abs(translateX.value)) {
        if (
          (translateX.value < 0 && res > 0) ||
          (translateX.value > 0 && res < 0)
        ) {
          runOnJS(togglePan)(true);
        }
      }
    },
  );

  // React.useEffect(() => {
  //   if (
  //     !enablePan &&
  //     maxTranslateX.value !== 0 &&
  //     maxTranslateX.value === Math.abs(translateX.value)
  //   ) {
  //     // togglePan(true);
  //   }
  // }, [enablePan]);

  const gestures = React.useMemo(
    () => Gesture.Exclusive(panGesture, holdGesture),
    [holdGesture, panGesture],
  );
  return gestures;
}
