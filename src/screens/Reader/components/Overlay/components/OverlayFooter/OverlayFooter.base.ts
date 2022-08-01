import Animated, { FadeInDown, FadeOutDown, Easing } from 'react-native-reanimated';
import styled, { css } from 'styled-components/native';

export const OverlayFooterContainer = styled(Animated.View).attrs({
  entering: FadeInDown.duration(100).easing(Easing.linear),
  exiting: FadeOutDown.duration(100).easing(Easing.linear),
})`
  ${(props) => css`
    background-color: rgba(0, 0, 0, 0.7);
    padding: ${props.theme.spacing(1, 3, 1, 3)};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
  `}
`;
