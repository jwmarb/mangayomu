import Box from '@components/Box';
import { useTheme } from '@emotion/react';
import useMountEffect from '@hooks/useMountEffect';
import React from 'react';
import {
  LayoutChangeEvent,
  SliderComponent,
  useWindowDimensions,
} from 'react-native';
import {
  BorderlessButton,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import { SliderProps } from './Slider.interfaces';

const AnimatedButton = Animated.createAnimatedComponent(BorderlessButton);

const styles = ScaledSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '30@ms',
    height: '30@ms',
  },
  trail: {
    height: '1.5@ms',
    marginVertical: '15@ms',
    position: 'absolute',
  },
});

const maxLeft = -moderateScale(15);

const Slider: React.FC<SliderProps> = (props) => {
  const {
    onChange = () => void 0,
    min = 0,
    max = 1,
    defaultValue = min,
    color = 'primary',
  } = props;

  const theme = useTheme();
  const { width } = useWindowDimensions();
  const mounted = React.useRef<boolean>(false);
  const [maxRight, setMaxRight] = React.useState<number>();
  const containerWidth = React.useRef<number>(width);
  const left = useSharedValue<number>(9999999);
  function handleOnChange(val: number) {
    if (mounted.current) onChange(val);
  }
  React.useLayoutEffect(() => {
    if (maxRight != null && !mounted.current) {
      // left.value =
      //   (containerWidth.current + 2 * maxLeft) * (defaultValue / (max - min));
      left.value = interpolate(
        defaultValue,
        [min, max],
        [maxLeft, maxRight ?? width],
      );
      mounted.current = true;
    }
  }, [maxRight]);
  const interpolatedValue = useDerivedValue(() =>
    interpolate(left.value, [maxLeft, maxRight ?? width], [min, max]),
  );
  useAnimatedReaction(
    () => interpolatedValue.value,
    (curr) => runOnJS(handleOnChange)(curr),
    [],
  );
  const panGesture = React.useMemo(
    () =>
      Gesture.Pan().onChange((e) => {
        left.value = Math.min(
          Math.max(left.value + e.changeX, maxLeft),
          maxRight ?? width,
        );
      }),
    [maxRight],
  );

  const buttonStyle = useAnimatedStyle(() => ({
    left: left.value,
  }));
  const trailStyle = useAnimatedStyle(() => ({
    width: left.value - maxLeft,
  }));

  const combinedBarStyles = React.useMemo(
    () => [buttonStyle, styles.button],
    [buttonStyle, styles.button],
  );

  const combinedTrailStyles = React.useMemo(
    () => [
      styles.trail,
      trailStyle,
      {
        backgroundColor: theme.helpers.getColor(color),
      },
    ],
    [theme, color],
  );

  const handleOnLayout = (e: LayoutChangeEvent) => {
    setMaxRight(e.nativeEvent.layout.width + maxLeft); // maxLeft is the padding
    containerWidth.current = e.nativeEvent.layout.width;
  };

  return (
    <Box flex-direction="row">
      <Box
        onLayout={handleOnLayout}
        width="100%"
        height={moderateScale(1.5)}
        background-color={theme.palette.background.disabled}
        my={moderateScale(15)}
      />
      <Animated.View style={combinedTrailStyles} />
      <GestureDetector gesture={panGesture}>
        <AnimatedButton
          borderless
          rippleColor={theme.palette.action.ripple}
          style={combinedBarStyles}
        >
          <Box
            align-self="center"
            width={moderateScale(15)}
            height={moderateScale(15)}
            background-color={theme.helpers.getColor(color)}
            border-radius={10000}
          ></Box>
        </AnimatedButton>
      </GestureDetector>
    </Box>
  );
};

export default Slider;
