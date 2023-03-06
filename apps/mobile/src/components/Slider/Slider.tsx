import Box from '@components/Box';
import { useTheme } from '@emotion/react';
import React from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
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
import { SliderProps, SliderMethods } from './Slider.interfaces';

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
  },
});

const maxLeft = -moderateScale(15);

const Slider: React.ForwardRefRenderFunction<SliderMethods, SliderProps> = (
  props,
  ref,
) => {
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
  const opacity = useSharedValue(0);
  const left = useSharedValue<number>(
    interpolate(min, [min, max], [maxLeft, maxRight ?? width]),
  );
  function handleOnChange(val: number) {
    if (mounted.current && opacity.value > 0) onChange(val);
  }
  React.useImperativeHandle(ref, () => ({
    setValue(val) {
      left.value = interpolate(val, [min, max], [maxLeft, maxRight ?? width]);
    },
  }));

  React.useEffect(() => {
    const listener = Dimensions.addEventListener('change', () => {
      opacity.value = 0;
    });
    return () => {
      listener.remove();
    };
  }, []);

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
    [handleOnChange],
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

  const composedGestures = React.useMemo(
    () =>
      Gesture.Simultaneous(
        Gesture.Tap().onStart((e) => {
          left.value = Math.min(Math.max(e.x, maxLeft), maxRight ?? width);
        }),
        Gesture.Pan().onChange((e) => {
          left.value = Math.min(Math.max(e.x, maxLeft), maxRight ?? width);
        }),
      ),
    [maxRight],
  );

  const buttonStyle = useAnimatedStyle(() => ({
    left: left.value,
    opacity: opacity.value,
  }));
  const trailStyle = useAnimatedStyle(() => ({
    width: left.value - maxLeft * 0.5,
    opacity: opacity.value,
  }));

  const combinedBarStyles = React.useMemo(
    () => [buttonStyle, styles.button],
    [buttonStyle, styles.button],
  );

  const combinedTrailStyles = React.useMemo(
    () => [
      trailStyle,
      styles.trail,
      {
        backgroundColor: theme.helpers.getColor(color),
      },
    ],
    [theme, color],
  );

  const handleOnLayout = (e: LayoutChangeEvent) => {
    const newWidth = e.nativeEvent.layout.width + maxLeft;
    left.value = interpolate(
      left.value,
      [maxLeft, maxRight ?? newWidth],
      [maxLeft, newWidth],
    );
    setTimeout(() => (opacity.value = 1), 1);

    setMaxRight(newWidth); // maxLeft is the padding: ;
    containerWidth.current = e.nativeEvent.layout.width;
  };

  return (
    <Box flex-direction="row" flex-grow>
      <GestureDetector gesture={composedGestures}>
        <Box flex-grow height={moderateScale(1.5)} py={moderateScale(15)}>
          <Box
            onLayout={handleOnLayout}
            flex-grow
            height={moderateScale(1.5)}
            background-color={theme.palette.background.disabled}
          />
        </Box>
      </GestureDetector>
      <GestureDetector gesture={composedGestures}>
        <Box position="absolute" py={moderateScale(15)}>
          <Animated.View style={combinedTrailStyles}></Animated.View>
        </Box>
      </GestureDetector>
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

export default React.forwardRef(Slider);