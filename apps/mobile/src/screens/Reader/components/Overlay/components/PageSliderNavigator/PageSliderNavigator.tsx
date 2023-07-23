import React from 'react';
import { PageSliderNavigatorMethods } from './PageSliderNavigator.interfaces';
import Box, { AnimatedBox } from '@components/Box';
import Text from '@components/Text/Text';
import { useTheme } from '@emotion/react';
import {
  OVERLAY_COLOR,
  OVERLAY_SLIDER_CIRCLE_RIPPLE_RADIUS,
  OVERLAY_SLIDER_HEIGHT,
} from '@theme/constants';
import { Gesture } from 'react-native-gesture-handler';
import SkipButton from '@screens/Reader/components/Overlay/components/PageSliderNavigator/components/SkipButton/SkipButton';
import { useParsedUserReaderSettings } from '@screens/Reader/context/ParsedUserReaderSettings';
import {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ReadingDirection } from '@redux/slices/settings';
import { LayoutChangeEvent } from 'react-native';
import { PageSliderNavigatorSnapPointsContext } from '@screens/Reader/components/Overlay/components/PageSliderNavigator/PageSliderNavigator.context';
import PageSliderDecorators from '@screens/Reader/components/Overlay/components/PageSliderNavigator/components/PageSliderDecorators/PageSliderDecorators';
import connector, {
  ConnectedPageSliderNavigatorProps,
} from './PageSliderNavigator.redux';
import { StyleSheet } from 'react-native';
import integrateSortedList from '@helpers/integrateSortedList';
import { NumberComparator } from '@mangayomu/algorithms';

const styles = StyleSheet.create({
  button: {
    width: OVERLAY_SLIDER_CIRCLE_RIPPLE_RADIUS * 2,
    height: OVERLAY_SLIDER_CIRCLE_RIPPLE_RADIUS * 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const PageSliderNavigator: React.ForwardRefRenderFunction<
  PageSliderNavigatorMethods,
  ConnectedPageSliderNavigatorProps
> = (props, ref) => {
  const {
    style,
    onSkipNext,
    onSkipPrevious,
    totalPages,
    onSnapToPoint,
    initialChapterPageIndex,
    isFinishedInitialScrollOffset,
    hide,
  } = props;
  const theme = useTheme();
  const [maxLeftDistance, setMaxLeftDistance] = React.useState<number>(0);
  const indexRef = React.useRef<number>(0);
  const { readingDirection } = useParsedUserReaderSettings();
  const reversed = readingDirection === ReadingDirection.RIGHT_TO_LEFT;
  const snapPoints = React.useMemo(() => {
    if (totalPages == null || !maxLeftDistance) return [];
    const snapLocation =
      totalPages > 1 ? maxLeftDistance / (totalPages - 1) : maxLeftDistance;
    const values: number[] = new Array(totalPages);
    if (reversed)
      for (let i = 0; i < totalPages; i++) {
        values[i] =
          (totalPages - 1 - i) * snapLocation -
          OVERLAY_SLIDER_CIRCLE_RIPPLE_RADIUS;
      }
    else
      for (let i = 0; i < totalPages; i++) {
        values[i] = i * snapLocation - OVERLAY_SLIDER_CIRCLE_RIPPLE_RADIUS;
      }

    return values;
  }, [totalPages, maxLeftDistance, reversed]);
  const left = useSharedValue<number>(-OVERLAY_SLIDER_CIRCLE_RIPPLE_RADIUS);
  const [isUserInput, setIsUserInput] = React.useState<boolean>(false);
  const visibleOpacity = useSharedValue(0);

  React.useEffect(() => {
    if (totalPages != null && isFinishedInitialScrollOffset && !hide) {
      left.value = snapPoints[initialChapterPageIndex];
      visibleOpacity.value = withTiming(1, {
        duration: 150,
        easing: Easing.ease,
      });
    }
  }, [totalPages, isFinishedInitialScrollOffset, hide]);

  React.useImperativeHandle(
    ref,
    () => ({
      snapPointTo(index: number) {
        if (!isUserInput && totalPages != null) {
          left.value = snapPoints[index];
          indexRef.current = index;
        }
      },
    }),
    [snapPoints, isUserInput, totalPages],
  );

  const panGesture = React.useMemo(
    () =>
      Gesture.Pan()
        .onChange((e) => {
          const parsed = Math.min(Math.max(0, e.x), maxLeftDistance);
          if (totalPages != null && totalPages > 1) {
            const snapLocation = maxLeftDistance / (totalPages - 1);
            const index = Math.round(parsed / snapLocation);
            const snapPoint = index * snapLocation;
            left.value = snapPoint - OVERLAY_SLIDER_CIRCLE_RIPPLE_RADIUS;
            runOnJS(onSnapToPoint)(index);
          } else {
            left.value = -OVERLAY_SLIDER_CIRCLE_RIPPLE_RADIUS;
            runOnJS(onSnapToPoint)(0);
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
      maxLeftDistance,
      setIsUserInput,
    ],
  );

  React.useEffect(() => {
    if (totalPages != null) left.value = snapPoints[indexRef.current];
  }, [reversed]);

  const tapGesture = React.useMemo(
    () =>
      Gesture.LongPress()
        .minDuration(0)
        .onStart((e) => {
          runOnJS(setIsUserInput)(true);
          if (totalPages != null && totalPages > 1) {
            const snapLocation = maxLeftDistance / (totalPages - 1);
            const index = Math.round(e.x / snapLocation);
            const snapPoint = index * snapLocation;
            left.value = snapPoint - OVERLAY_SLIDER_CIRCLE_RIPPLE_RADIUS;
            runOnJS(onSnapToPoint)(index);
          } else {
            left.value = -OVERLAY_SLIDER_CIRCLE_RIPPLE_RADIUS;
            runOnJS(onSnapToPoint)(0);
          }
        })
        .onEnd(() => {
          runOnJS(setIsUserInput)(false);
        }),
    [snapPoints, maxLeftDistance, totalPages, setIsUserInput, onSnapToPoint],
  );

  const gesture = React.useMemo(
    () => Gesture.Simultaneous(tapGesture, panGesture),
    [tapGesture, panGesture],
  );

  const trail = useDerivedValue(
    () => maxLeftDistance - left.value - OVERLAY_SLIDER_CIRCLE_RIPPLE_RADIUS,
  );
  const btnStyle = useAnimatedStyle(() => ({
    opacity: visibleOpacity.value,
    left: left.value,
  }));
  const snapPointStyle = useAnimatedStyle(() => ({
    opacity: visibleOpacity.value,
  }));
  const trailStyle = useAnimatedStyle(() =>
    !reversed
      ? {
          right: trail.value,
          left: 0,
        }
      : {
          right: 0,
          left: left.value + OVERLAY_SLIDER_CIRCLE_RIPPLE_RADIUS,
        },
  );
  const combinedButtonStyle = React.useMemo(
    () => [btnStyle, styles.button],
    [],
  );
  const handleOnLayout = React.useCallback(
    (e: LayoutChangeEvent) => {
      setMaxLeftDistance(e.nativeEvent.layout.width);
    },
    [setMaxLeftDistance],
  );

  const memoTrailStyle = React.useMemo(
    () => [trailStyle, snapPointStyle],
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
        <Box mr="m" align-self="center">
          <Text>{reversed ? totalPages : 1}</Text>
        </Box>
        <PageSliderNavigatorSnapPointsContext.Provider value={snapPoints}>
          <PageSliderDecorators
            trailStyle={memoTrailStyle}
            snapPointStyle={snapPointStyle}
            gesture={gesture}
            style={combinedButtonStyle}
            onLayout={handleOnLayout}
          />
        </PageSliderNavigatorSnapPointsContext.Provider>

        <Box ml="m" align-self="center">
          <Text>{reversed ? 1 : totalPages}</Text>
        </Box>
      </Box>
      <SkipButton next onSkip={onSkipNext} />
    </AnimatedBox>
  );
};

export default connector(React.forwardRef(PageSliderNavigator));
