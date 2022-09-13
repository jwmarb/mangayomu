import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { shadowDrop } from '@theme/core';

export const FloatingActionButtonContainer = styled.View.attrs({ pointerEvents: 'box-none' })`
  position: absolute;
  flex-direction: row-reverse;
  align-items: flex-end;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  z-index: 10000;
`;

export const FloatingActionButtonBase = styled(Animated.View)`
  ${(props) => css`
    padding: ${props.theme.spacing(2)};
  `}
`;

export const FloatingActionButtonWrapper = styled.View.attrs(shadowDrop)`
  border-radius: 1000px;
  ${(props) => css`
    background-color: ${props.theme.palette.primary.main.get()};
    bottom: ${props.theme.spacing(4)};
    left: ${props.theme.spacing(4)};
  `}
`;

export const FloatingActionButtonLayoutGetter = styled.View.attrs({ pointerEvents: 'none' })`
  opacity: 0;
`;
