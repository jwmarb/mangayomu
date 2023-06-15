import React from 'react';
import {
  PageSliderNavigatorMethods,
  PageSliderNavigatorProps,
} from './PageSliderNavigator.interfaces';
import Box, { AnimatedBox } from '@components/Box';
import Text from '@components/Text/Text';
import { useTheme } from '@emotion/react';
import Slider from '@components/Slider/Slider';
import Icon from '@components/Icon/Icon';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import {
  OVERLAY_COLOR,
  OVERLAY_SLIDER_CIRCLE_DEFAULT_OFFSET,
  OVERLAY_SLIDER_HEIGHT,
} from '@theme/constants';
import {
  BorderlessButton,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import SkipButton from '@screens/Reader/components/Overlay/components/PageSliderNavigator/components/SkipButton/SkipButton';
import { useParsedUserReaderSettings } from '@screens/Reader/context/ParsedUserReaderSettings';
import { hexToRgb, rgbaToString } from '@mangayomu/theme';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import SnapPoints from '@screens/Reader/components/Overlay/components/PageSliderNavigator/components/SnapPoints/SnapPoints';
import { ReadingDirection } from '@redux/slices/settings';
import { LayoutChangeEvent } from 'react-native';
import { PageSliderNavigatorSnapPointsContext } from '@screens/Reader/components/Overlay/components/PageSliderNavigator/PageSliderNavigator.context';
import PageSliderDecorators from '@screens/Reader/components/Overlay/components/PageSliderNavigator/components/PageSliderDecorators/PageSliderDecorators';

const styles = ScaledSheet.create({
  button: {
    width: '32@ms' as unknown as number,
    height: '32@ms' as unknown as number,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const PageSliderNavigator: React.ForwardRefRenderFunction<
  PageSliderNavigatorMethods,
  PageSliderNavigatorProps
> = (props, ref) => {
  const {
    style,
    onSkipNext,
    onSkipPrevious,
    totalPages,
    onSnapToPoint,
    initialChapterPageIndex,
    isFinishedInitialScrollOffset,
  } = props;
  const theme = useTheme();
  const [maxLeftDistance, setMaxLeftDistance] = React.useState<number>(0);
  const totalDistance = maxLeftDistance - OVERLAY_SLIDER_CIRCLE_DEFAULT_OFFSET;
  const snapPoints = React.useMemo(() => {
    if (totalPages == null || !totalDistance) return [];
    const snapLocation = totalDistance / (totalPages - 1);
    const values = new Array(totalPages);
    for (let i = 0; i < totalPages; i++) {
      values[i] = i * snapLocation + OVERLAY_SLIDER_CIRCLE_DEFAULT_OFFSET;
    }
    return values;
  }, [totalPages, totalDistance]);
  const left = useSharedValue<number>(OVERLAY_SLIDER_CIRCLE_DEFAULT_OFFSET);
  const { readingDirection } = useParsedUserReaderSettings();
  const [isUserInput, setIsUserInput] = React.useState<boolean>(false);
  const visibleOpacity = useSharedValue(0);
  const reversed = readingDirection === ReadingDirection.RIGHT_TO_LEFT;
  React.useEffect(() => {
    if (
      totalPages != null &&
      totalDistance != null &&
      isFinishedInitialScrollOffset
    ) {
      left.value =
        snapPoints[
          reversed
            ? totalPages - initialChapterPageIndex - 1
            : initialChapterPageIndex
        ];
      visibleOpacity.value = withTiming(1, {
        duration: 150,
        easing: Easing.ease,
      });
    }
  }, [totalPages, isFinishedInitialScrollOffset]);

  React.useImperativeHandle(
    ref,
    () => ({
      snapPointTo(index: number) {
        if (!isUserInput) left.value = snapPoints[index];
      },
    }),
    [snapPoints, isUserInput],
  );
  const panGesture = React.useMemo(
    () =>
      Gesture.Pan()
        .onChange((e) => {
          const parsed = Math.min(
            Math.max(OVERLAY_SLIDER_CIRCLE_DEFAULT_OFFSET, e.x),
            maxLeftDistance,
          );

          if (totalPages != null) {
            const index = Math.floor(
              (parsed - OVERLAY_SLIDER_CIRCLE_DEFAULT_OFFSET) /
                (totalDistance / totalPages),
            );
            if (parsed - snapPoints[index] <= 10) {
              left.value = snapPoints[index];
              runOnJS(onSnapToPoint)(index);
            }
          }
        })
        .onStart(() => {
          runOnJS(setIsUserInput)(true);
        })
        .onEnd(() => {
          runOnJS(setIsUserInput)(false);
        }),
    [
      maxLeftDistance,
      snapPoints,
      onSnapToPoint,
      totalPages,
      totalDistance,
      setIsUserInput,
      reversed,
    ],
  );

  const tapGesture = React.useMemo(
    () =>
      Gesture.LongPress()
        .minDuration(0)
        .onStart((e) => {
          if (totalPages != null) {
            runOnJS(setIsUserInput)(true);
            left.value = e.x + OVERLAY_SLIDER_CIRCLE_DEFAULT_OFFSET;
            const index = Math.min(
              Math.round(e.x / (totalDistance / totalPages)),
              totalPages - 1,
            );
            left.value = snapPoints[index];
            runOnJS(onSnapToPoint)(index);
          }
        }),
    [
      snapPoints,
      totalDistance,
      totalPages,
      setIsUserInput,
      onSnapToPoint,
      reversed,
    ],
  );

  const gesture = React.useMemo(
    () => Gesture.Simultaneous(tapGesture, panGesture),
    [tapGesture, panGesture],
  );

  const btnStyle = useAnimatedStyle(() => ({
    left: left.value,
    opacity: visibleOpacity.value,
  }));
  const snapPointStyle = useAnimatedStyle(() => ({
    opacity: visibleOpacity.value,
  }));
  const trail = useDerivedValue(() => maxLeftDistance - left.value);
  const trailStyle = useAnimatedStyle(() =>
    !reversed
      ? {
          right: trail.value,
          left: OVERLAY_SLIDER_CIRCLE_DEFAULT_OFFSET / 2,
        }
      : {
          right: OVERLAY_SLIDER_CIRCLE_DEFAULT_OFFSET / 2,
          left: left.value - OVERLAY_SLIDER_CIRCLE_DEFAULT_OFFSET,
        },
  );
  const combinedButtonStyle = React.useMemo(
    () => [btnStyle, styles.button],
    [],
  );
  const handleOnLayout = React.useCallback(
    (e: LayoutChangeEvent) => {
      setMaxLeftDistance(
        e.nativeEvent.layout.width + OVERLAY_SLIDER_CIRCLE_DEFAULT_OFFSET,
      );
    },
    [setMaxLeftDistance],
  );

  const memoTrailStyle = React.useMemo(
    () => trailStyle,
    [reversed, maxLeftDistance],
  );
  return (
    <AnimatedBox
      style={style}
      position="absolute"
      bottom={0}
      left={theme.style.spacing.s}
      right={theme.style.spacing.s}
      flex-direction="row"
    >
      <SkipButton previous onSkip={onSkipPrevious} />
      <Box
        mx="s"
        background-color={OVERLAY_COLOR}
        height={OVERLAY_SLIDER_HEIGHT}
        flex-grow
        justify-content="space-between"
        flex-direction="row"
        align-items="center"
        border-radius={10000}
        px="m"
      >
        <Text>{reversed ? totalPages : 1}</Text>
        <PageSliderNavigatorSnapPointsContext.Provider value={snapPoints}>
          <PageSliderDecorators
            trailStyle={memoTrailStyle}
            snapPointStyle={snapPointStyle}
            gesture={gesture}
            style={combinedButtonStyle}
            onLayout={handleOnLayout}
          />
        </PageSliderNavigatorSnapPointsContext.Provider>

        <Text>{reversed ? 1 : totalPages}</Text>
      </Box>
      <SkipButton next onSkip={onSkipNext} />
    </AnimatedBox>
  );
};

export default React.forwardRef(PageSliderNavigator);
