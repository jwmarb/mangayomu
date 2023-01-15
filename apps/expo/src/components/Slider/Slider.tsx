import { SliderProps } from '@components/Slider/Slider.interfaces';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import React from 'react';
import Animated, {
  cancelAnimation,
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
import useMountedEffect from '@hooks/useMountedEffect';
import { useSelector } from 'react-redux';
import { AppState } from '@redux/store';

const Slider: React.FC<SliderProps> = (props) => {
  const {
    left,
    right,
    width,
    onChange,
    range: [min, max],
    noFixedIncremental = false,
    readerSlider = false,
    value,
  } = props;
  const range = Math.abs(max - min);
  const shouldUpdate = React.useRef<boolean>(true);
  function enableUpdater() {
    shouldUpdate.current = true;
  }
  function disableUpdater() {
    shouldUpdate.current = false;
  }
  const deviceOrientation = useSelector((state: AppState) => state.settings.deviceOrientation);
  useMountedEffect(() => {
    if (shouldUpdate.current)
      positionLeft.value = withTiming(Math.min((width / range) * (value - min), width), {
        duration: 100,
        easing: Easing.ease,
      });
  }, [width, deviceOrientation, range, value]);
  const positionLeft = useSharedValue(Math.min((width / range) * (value - min), width));
  const gestureHandlers = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {
      translateX: number;
    }
  >({
    onActive: (e, ctx) => {
      const translateX = Math.max(Math.min(e.translationX + ctx.translateX, width), 0);
      runOnJS(disableUpdater)();
      if (noFixedIncremental) {
        const value = translateX / width / (width / (range * width));
        positionLeft.value = value * (width / range);
        runOnJS(onChange)(value + min);
      } else {
        const value = Math.round(translateX / width / (width / (range * width)));

        if (positionLeft.value !== value * (width / range)) runOnJS(onChange)(value + min);
        positionLeft.value = value * (width / range);
      }
    },
    onStart: (_, ctx) => {
      ctx.translateX = positionLeft.value;
    },
    onEnd: () => {
      runOnJS(enableUpdater)();
    },
  });
  const style = useAnimatedStyle(() => ({
    left: positionLeft.value,
  }));
  const filledStyle = useAnimatedStyle(() => ({
    width: positionLeft.value,
  }));
  React.useEffect(() => {
    return () => {
      cancelAnimation(positionLeft);
    };
  }, []);
  return (
    <SliderContainer>
      {left}
      <Spacer x={2} />
      <SliderLine width={width}>
        <SliderFilledLine style={filledStyle} />
      </SliderLine>
      <PanGestureHandler onGestureEvent={gestureHandlers}>
        <SliderCircleBaseContainer readerSlider={readerSlider} style={style}>
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
