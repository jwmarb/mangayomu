import useAnimatedMutableObject from '@hooks/useAnimatedMutableObject';
import useAppSelector from '@hooks/useAppSelector';
import useBoolean from '@hooks/useBoolean';
import useMountedEffect from '@hooks/useMountedEffect';
import useMutableObject from '@hooks/useMutableObject';
import useScreenDimensions from '@hooks/useScreenDimensions';
import { store, useAppDispatch } from '@redux/main';
import { toggleImageModal } from '@redux/slices/reader';
import { ReadingDirection } from '@redux/slices/settings';
import { ChapterPageProps } from '@screens/Reader/components/ChapterPage';
import { useChapterPageContext } from '@screens/Reader/components/ChapterPage/context/ChapterPageContext';
import usePageZooming from '@screens/Reader/components/ChapterPage/hooks/usePageZooming';
import React from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';

export default function usePageGestures(
  pageZoomingProps: ReturnType<typeof usePageZooming>,
  props: ChapterPageProps,
  stylizedHeight: number,
  enablePan: boolean,
  togglePan: (val?: boolean) => void,
) {
  const { pinchScale, translateX, translateY, minScale } = pageZoomingProps;
  const {
    page: { page: pageKey },
  } = props;
  const { height: screenHeight, width: screenWidth } = useScreenDimensions();

  const isFlashListActive = useAppSelector(
    (state) => state.reader.isFlashListActive,
  );

  function compareScaleUI() {
    'worklet';
    return (
      (minScale.value > 1 && pinchScale.value >= 1) ||
      pinchScale.value > minScale.value
    );
  }
  function compareScaleJS() {
    return (
      (minScale.value > 1 && pinchScale.value >= 1) ||
      pinchScale.value > minScale.value
    );
  }

  const { readingDirection, nativeFlatListGesture } = useChapterPageContext();
  const readingDirectionRef = useMutableObject(readingDirection);
  const maxTranslateX = useSharedValue(Math.abs(translateX.value));
  const maxTranslateY = useSharedValue(Math.abs(translateY.value));

  const isHorizontal = useAnimatedMutableObject(
    readingDirection === ReadingDirection.LEFT_TO_RIGHT ||
      readingDirection === ReadingDirection.RIGHT_TO_LEFT,
  );
  const isVertical = useAnimatedMutableObject(
    readingDirection === ReadingDirection.VERTICAL,
  );

  const isAtEdgeHorizontal = useSharedValue(
    isHorizontal.value && Math.abs(translateX.value) === maxTranslateX.value,
  );
  const isAtEdgeVertical = useSharedValue(
    isVertical.value && Math.abs(translateY.value) === maxTranslateY.value,
  );

  const mutablePageKey = useMutableObject(pageKey);
  const height = useAnimatedMutableObject(screenHeight);
  const width = useAnimatedMutableObject(screenWidth);

  const {
    imageMenuRef,
    pageGestures,
    rootPinchGesture,
    imageScaling: _imageScaling,
  } = useChapterPageContext();

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
          pinchScale.value + (e.scaleChange - 1) * 1.5,
          minScale.value,
        );
      },
      onDoubleTap(e) {
        'worklet';
        if (compareScaleUI()) {
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
      onFlashlistEnd() {
        if (!enablePan && compareScaleJS()) {
          togglePan(true);
        }
      },
    };
    return () => {
      delete pageGestures.current[pageKey]; // deallocate unused page
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
        .enabled(!isFlashListActive)
        .enableTrackpadTwoFingerGesture(true)
        .onChange((e) => {
          if (readingDirectionRef.current !== ReadingDirection.WEBTOON) {
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

            isAtEdgeHorizontal.value =
              isHorizontal.value &&
              Math.abs(translateX.value) === maxTranslateX.value;
            isAtEdgeVertical.value =
              isVertical.value &&
              Math.abs(translateY.value) === maxTranslateY.value;

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
            } else if (isAtEdgeHorizontal.value || isAtEdgeVertical.value) {
              // console.log('isAtEdgeHorizontal triggered');
              runOnJS(togglePan)(false);
            } else if (!enablePan) {
              console.log('pan enabled here');
              runOnJS(togglePan)(true);
            }
          }
        })
        .onEnd((e) => {
          if (readingDirectionRef.current !== ReadingDirection.WEBTOON) {
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
          }
        })
        .simultaneousWithExternalGesture(
          ...(!enablePan
            ? [rootPinchGesture, nativeFlatListGesture]
            : [rootPinchGesture]),
        ),
    [enablePan, rootPinchGesture, nativeFlatListGesture, isFlashListActive],
  );

  /**
   * Re-enables panning shortly after user reached max translation value
   */
  React.useEffect(() => {
    if (
      (isAtEdgeHorizontal.value || isAtEdgeVertical.value) &&
      !enablePan &&
      compareScaleJS()
    ) {
      const p = setTimeout(() => togglePan(true), 600);
      return () => {
        clearTimeout(p);
      };
    }
  }, [enablePan]);

  // React.useEffect(() => {
  //   console.log(
  //     `\n---\npage #: ${pageNumber}\nenablePan: ${enablePan}\npinchScale: ${pinchScale.value}\nminScale: ${minScale.value}\n---\n`,
  //   );
  // }, [enablePan]);

  const gestures = React.useMemo(
    () => Gesture.Exclusive(panGesture, holdGesture),
    [holdGesture, panGesture],
  );
  return gestures;
}
