import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  FadeIn,
  FadeOut,
  Easing,
  Layout,
} from 'react-native-reanimated';
import styled, { css } from 'styled-components/native';
import { StatusBar } from 'react-native';

export const OverlayWrapper = styled.View.attrs({ pointerEvents: 'box-none' })<{ width: number; height: number }>`
  ${(props) => {
    return css`
      width: ${props.width}px;
      height: ${props.height}px;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      flex-grow: 1;
      justify-content: space-between;

      /* background-color: red; */
    `;
  }}
`;

export const OverlayFooterWrapper = styled.View`
  flex-grow: 1;
  flex-direction: column;
  justify-content: flex-end;
`;
