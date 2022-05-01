import { SliderProps } from '@components/Slider/Slider.interfaces';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import React from 'react';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  SliderCircle,
  SliderCircleBaseContainer,
  SliderContainer,
  SliderFilledLine,
  SliderLine,
} from '@components/Slider/Slider.base';
import { View } from 'react-native';
import Flex from '@components/Flex';
import ButtonBase from '@components/Button/ButtonBase';
import Spacer from '@components/Spacer';

const Slider: React.FC<SliderProps> = (props) => {
  const {
    left,
    right,
    width,
    onChange,
    range: [min, max],
    value,
  } = props;
  const range = Math.abs(max - min);
  const positionLeft = useSharedValue((width / range) * (value - min));
  const gestureHandlers = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {
      translateX: number;
    }
  >({
    onActive: (e, ctx) => {
      const translateX = Math.max(Math.min(e.translationX + ctx.translateX, width), 0);
      const value = Math.round(translateX / width / (width / (range * width)));

      positionLeft.value = withTiming(value * (width / range), {
        duration: 100,
        easing: Easing.linear,
      });
      runOnJS(onChange)(value + min);
    },
    onStart: (_, ctx) => {
      ctx.translateX = positionLeft.value;
    },
  });
  const style = useAnimatedStyle(() => ({
    left: positionLeft.value,
  }));
  const filledStyle = useAnimatedStyle(() => ({
    width: positionLeft.value,
  }));
  return (
    <SliderContainer>
      {left}
      <Spacer x={2} />
      <SliderLine width={width}>
        <SliderFilledLine style={filledStyle} />
      </SliderLine>
      <PanGestureHandler onGestureEvent={gestureHandlers}>
        <SliderCircleBaseContainer style={style}>
          <ButtonBase onPress={() => {}} round color='primary'>
            <SliderCircle />
          </ButtonBase>
        </SliderCircleBaseContainer>
      </PanGestureHandler>
      <Spacer x={2} />
      {right}
    </SliderContainer>
  );
};

export default Slider;
