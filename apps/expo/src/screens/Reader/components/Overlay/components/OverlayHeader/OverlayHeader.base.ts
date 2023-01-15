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

export const OverlayHeaderContainer = styled(Animated.View).attrs({
  entering: FadeInUp.duration(100).easing(Easing.linear),
  exiting: FadeOutUp.duration(100).easing(Easing.linear),
})`
  ${(props) => {
    return css`
      background-color: rgba(0, 0, 0, 0.7);
      padding: ${props.theme.spacing(1, 3, 2, 3)};
      display: flex;
      flex-direction: column;
    `;
  }}
`;
