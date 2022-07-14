import {
  SwitchBase,
  SwitchCircle,
  SwitchCircleBase,
  SwitchCircleDebug,
  SwitchCircleEnabled,
  SwitchCirclePadding,
  SwitchSlider,
  SwitchSliderEnabled,
} from '@components/Switch/Switch.base';
import { useTheme } from 'styled-components/native';
import React from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SwitchProps } from './Switch.interfaces';
import { Constants } from '@theme/core';
import { TouchableWithoutFeedback } from 'react-native';
import ButtonBase from '@components/Button/ButtonBase';
import { Container } from '@components/Container';
import Flex from '@components/Flex';

const Switch: React.FC<SwitchProps> = (props) => {
  const { enabled, onChange = () => void 0 } = props;
  const opacityDisabled = useSharedValue(0);
  const opacityEnabled = useSharedValue(1);
  const translateX = useSharedValue(0);
  React.useEffect(() => {
    if (enabled) {
      opacityDisabled.value = withTiming(0, { duration: 100 });
      opacityEnabled.value = withTiming(1, { duration: 100 });
      translateX.value = withTiming(12, { duration: 100, easing: Easing.ease });
    } else {
      opacityEnabled.value = withTiming(0, { duration: 100 });
      opacityDisabled.value = withTiming(1, { duration: 100 });
      translateX.value = withTiming(-12, { duration: 100, easing: Easing.ease });
    }
  }, [enabled]);

  const disabledSliderStyle = useAnimatedStyle(() => ({
    opacity: opacityDisabled.value,
  }));
  const enabledSliderStyle = useAnimatedStyle(() => ({
    opacity: opacityEnabled.value,
  }));

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  function handleOnPress() {
    onChange(!enabled);
  }

  return (
    <TouchableWithoutFeedback onPress={handleOnPress}>
      <SwitchBase>
        <SwitchSliderEnabled style={enabledSliderStyle} />
        <SwitchSlider style={disabledSliderStyle} />
        <SwitchCircleBase style={circleStyle}>
          <ButtonBase round onPress={handleOnPress}>
            <SwitchCirclePadding>
              <SwitchCircle style={disabledSliderStyle} />
              <SwitchCircleEnabled style={enabledSliderStyle} />
            </SwitchCirclePadding>
          </ButtonBase>
        </SwitchCircleBase>
      </SwitchBase>
    </TouchableWithoutFeedback>
  );
};

export default Switch;
