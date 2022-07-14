import { Constants } from '@theme/core';
import Animated from 'react-native-reanimated';
import styled, { css } from 'styled-components/native';

export const SwitchCircleDebug = styled(Animated.View)`
  ${(props) => css`
    width: 20px;
    height: 20px;
    background-color: ${props.theme.palette.secondary.main.get()};
    opacity: 0.5;
    border-radius: 1000px;
    position: absolute;
  `}
`;

export const SwitchCircle = styled(Animated.View)`
  ${() => css`
    width: 20px;
    height: 20px;
    background-color: ${Constants.GRAY[6].get()};
    border-radius: 1000px;
    position: absolute;
  `}
`;

export const SwitchCirclePadding = styled.View`
  ${(props) => css`
    width: 35px;
    height: 35px;
    align-items: center;
    justify-content: center;
  `}
`;

export const SwitchCircleBase = styled(Animated.View)`
  position: absolute;
`;

export const SwitchCircleEnabled = styled(Animated.View)`
  ${(props) => css`
    background-color: ${props.theme.palette.primary[props.theme.palette.mode === 'light' ? 'dark' : 'light'].get()};
    width: 20px;
    height: 20px;
    border-radius: 1000px;
    position: absolute;
  `}
`;

export const SwitchSlider = styled(Animated.View)`
  ${(props) => css`
    width: 35px;
    height: 15px;
    border-radius: 1000px;
    background-color: ${props.theme.palette.action.disabledBackground.get()};
  `}
`;

export const SwitchSliderEnabled = styled(Animated.View)`
  ${(props) => css`
    position: absolute;
    width: 35px;
    height: 15px;
    border-radius: 1000px;
    background-color: ${props.theme.palette.primary[props.theme.palette.mode ?? 'light'].get()};
  `}
`;

export const SwitchBase = styled.View`
  width: 62px;
  height: 35px;
  overflow: visible;
  justify-content: center;
  align-items: center;
`;
