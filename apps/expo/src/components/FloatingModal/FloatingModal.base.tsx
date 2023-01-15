import styled, { css } from 'styled-components/native';
import Animated, { FadeIn, FadeOut, SlideOutDown, SlideInDown } from 'react-native-reanimated';
import { shadowDrop } from '@theme/core';

export const FloatingModalBaseContainer = styled(Animated.View).attrs({
  pointerEvents: 'box-none',
  entering: FadeIn,
  exiting: FadeOut,
})`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
export const FloatingModalContainer = styled(Animated.View).attrs(shadowDrop)`
  ${(props) => css`
    position: absolute;
    left: 0;
    right: 0;
    padding: ${props.theme.spacing(1, 2)};
    margin: ${props.theme.spacing(0, 2)};
    background-color: ${props.theme.palette.background.paper.get()};
    border-top-left-radius: ${props.theme.borderRadius}px;
    border-bottom-left-radius: ${props.theme.borderRadius}px;
    border-top-right-radius: ${props.theme.borderRadius}px;
    border-bottom-right-radius: ${props.theme.borderRadius}px;
  `}
`;
