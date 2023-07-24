import useAnimatedMutableObject from '@hooks/useAnimatedMutableObject';
import useBoolean from '@hooks/useBoolean';
import useMutableObject from '@hooks/useMutableObject';
import useScreenDimensions from '@hooks/useScreenDimensions';
import { useAppDispatch } from '@redux/main';
import { toggleImageModal } from '@redux/slices/reader';
import { ImageScaling, ReadingDirection } from '@redux/slices/settings';
import { ConnectedChapterPageProps } from '@screens/Reader/components/ChapterPage/ChapterPage.redux';
import { useChapterPageContext } from '@screens/Reader/components/ChapterPage/context/ChapterPageContext';
import usePageZooming from '@screens/Reader/components/ChapterPage/hooks/usePageZooming';
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
  readingDirection: ReadingDirection;
  minScale: SharedValue<number>;
}

export default function usePageGestures(
  pageZoomingProps: ReturnType<typeof usePageZooming>,
  props: ConnectedChapterPageProps,
  stylizedHeight: number,
) {
  const { pinchScale, translateX, translateY, minScale } = pageZoomingProps;
  const {
    page: { page: pageKey },
  } = props;
  const { height: screenHeight, width: screenWidth } = useScreenDimensions();

  const { readingDirection } = useChapterPageContext();
  const [enablePan, togglePan] = useBoolean(pinchScale.value > minScale.value);

  const mutablePageKey = useMutableObject(pageKey);
  const height = useAnimatedMutableObject(screenHeight);
  const width = useAnimatedMutableObject(screenWidth);
  const isHorizontal = useAnimatedMutableObject(
    readingDirection === ReadingDirection.LEFT_TO_RIGHT ||
      readingDirection === ReadingDirection.RIGHT_TO_LEFT,
  );
  const isVertical = useAnimatedMutableObject(
    readingDirection === ReadingDirection.VERTICAL,
  );
  const {
    imageMenuRef,
    velocityX,
    rootPanGesture,
    pageGestures,
    rootPinchGesture,
    velocityY,
    imageScaling: _imageScaling,
  } = useChapterPageContext();

  const maxTranslateX = useSharedValue(Math.abs(translateX.value));
  const maxTranslateY = useSharedValue(Math.abs(translateY.value));

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
        pinchScale.value = Math.max(
          pinchScale.value + e.scaleChange - 1,
          minScale.value,
        );
      },
      onDoubleTap(e) {
        'worklet';
        if (pinchScale.value > minScale.value) {
          pinchScale.value = withTiming(minScale.value, {
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
            stylizedHeight / 2 - height.value / (scaleValue * 2),
          );
          const calculatedMaxTranslateX =
            width.value / 2 - width.value / (scaleValue * 2);
          maxTranslateX.value = withTiming(calculatedMaxTranslateX, config);
          maxTranslateY.value = withTiming(calculatedMaxTranslateY, config);
          translateX.value = withTiming(
            Math.min(
              Math.max(-calculatedMaxTranslateX, width.value / 2 - e.x),
              calculatedMaxTranslateX,
            ),
            config,
          );
          translateY.value = withTiming(
            Math.min(
              calculatedMaxTranslateY,
              Math.max(-calculatedMaxTranslateY, height.value / 2 - e.y),
            ),
            config,
          );
        }
      },
      onFlashlistActive() {
        if (
          ((maxTranslateX.value === Math.abs(translateX.value) &&
            isHorizontal.value) ||
            (maxTranslateY.value === Math.abs(translateY.value) &&
              isVertical.value)) &&
          !enablePan &&
          pinchScale.value > minScale.value
        )
          togglePan(true);
      },
    };
  }, [pageKey]);

  useAnimatedReaction(
    () => pinchScale.value,
    (result) => {
      maxTranslateX.value =
        result > 1 ? width.value / 2 - width.value / (pinchScale.value * 2) : 0;
      maxTranslateY.value = Math.max(
        0,
        stylizedHeight / 2 - height.value / (pinchScale.value * 2),
      );

      const isPortrait = width.value < height.value;
      const isLandscape = width.value > height.value;
      const isImageWide = isPortrait && result > 1; // Originally, all images are fitted to match screen width then scaled from their size, so this technically works
      const isImageTall = isLandscape && minScale.value >= 1;

      runOnJS(togglePan)(
        isImageWide || isImageTall
          ? result >= minScale.value
          : result > minScale.value,
      );
    },
    [stylizedHeight, _imageScaling],
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

          if (maxTranslateX.value === 0 && maxTranslateY.value === 0) {
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
            (maxTranslateX.value === Math.abs(translateX.value) &&
              isHorizontal.value &&
              Math.abs(velocityY.value) <= 5000 &&
              ((translateX.value <= 0 && velocityX.value < -1500) ||
                (translateX.value >= 0 && velocityX.value > 1500))) ||
            (maxTranslateY.value === Math.abs(translateY.value) &&
              isVertical.value &&
              ((translateY.value <= 0 && velocityY.value < -1500) ||
                (translateY.value >= 0 && velocityY.value > 1500)))
          ) {
            runOnJS(togglePan)(false);
          }
        })
        .simultaneousWithExternalGesture(rootPanGesture, rootPinchGesture)
        .enabled(enablePan),
    [enablePan],
  );
  useAnimatedReaction(
    () => velocityX.value,
    (res) => {
      if (
        maxTranslateX.value === Math.abs(translateX.value) &&
        isHorizontal.value &&
        ((translateX.value < 0 && res > 0) || (translateX.value > 0 && res < 0))
      )
        runOnJS(togglePan)(true);
    },
  );

  useAnimatedReaction(
    () => velocityY.value,
    (res) => {
      if (
        maxTranslateY.value === Math.abs(translateY.value) &&
        isVertical.value &&
        ((translateY.value < 0 && res > 0) || (translateY.value > 0 && res < 0))
      ) {
        runOnJS(togglePan)(true);
      }
    },
  );

  React.useEffect(() => {
    if (
      ((maxTranslateX.value === Math.abs(translateX.value) &&
        isHorizontal.value) ||
        (maxTranslateY.value === Math.abs(translateY.value) &&
          isVertical.value)) &&
      !enablePan &&
      pinchScale.value > minScale.value
    ) {
      const p = setTimeout(() => {
        togglePan(true);
      }, 1000);
      return () => {
        clearTimeout(p);
      };
    }
  }, [enablePan]);

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
