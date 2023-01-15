import styled, { css } from 'styled-components/native';
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

export const OverlayPageContainer = styled(Animated.View).attrs({
  entering: FadeIn.duration(100).easing(Easing.linear),
  exiting: FadeOut.duration(100).easing(Easing.linear),
})`
  ${(props) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: ${props.theme.spacing(1)};
    position: absolute;
    left: 0;
    right: 0;
  `}
`;

export const OverlayPageBackground = styled.View`
  ${(props) => css`
    background-color: rgba(0, 0, 0, 0.7);
    padding: ${props.theme.spacing(0.75, 1.5)};
    border-radius: ${props.theme.borderRadius}px;
  `}
`;
