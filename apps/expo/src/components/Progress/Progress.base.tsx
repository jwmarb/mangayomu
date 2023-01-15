import { ProgressProps } from '@components/Progress/Progress.interfaces';
import { Color } from '@theme/core';
import { Dimensions } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { rem } from '@theme/Typography';
import styled, { css } from 'styled-components/native';
export const ProgressCircle = styled.View<ProgressProps>`
  ${(props) => css`
    background-color: ${Color.valueOf(props.color ?? 'primary')};
    width: ${rem(6)};
    height: ${rem(6)};
    border-radius: 100px;
  `}
`;

export const BarIndicator = styled(Animated.View)`
  ${(props) => {
    const { width } = Dimensions.get('window');
    return css`
      background-color: ${props.theme.palette.primary.main.get()};
      height: 2px;
      width: ${width / 2}px;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      top: 0;
      z-index: 1;
    `;
  }}
`;

export const BarBackground = styled.View`
  ${(props) => {
    const { width } = Dimensions.get('window');

    return css`
      background-color: ${props.theme.palette.primary[props.theme.palette.mode ?? 'light'].get()};
      height: 2px;
      width: ${width}px;
      opacity: 0.55;
      z-index: -1;
      position: absolute;
    `;
  }}
`;

export const BarContainer = styled(Animated.View).attrs({ entering: FadeIn, exiting: FadeOut })`
  ${(props) => {
    const { width } = Dimensions.get('window');

    return css`
      display: flex;
      flex-grow: 1;
      height: 2px;
      width: ${width}px;
    `;
  }}
`;
