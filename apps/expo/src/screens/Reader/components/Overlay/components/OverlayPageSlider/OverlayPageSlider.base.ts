import Animated, { FadeInDown, FadeOutDown, Easing } from 'react-native-reanimated';
import styled, { css } from 'styled-components/native';

export const OverlayPageSliderContainer = styled(Animated.View).attrs({
  entering: FadeInDown.duration(100).easing(Easing.linear),
  exiting: FadeOutDown.duration(100).easing(Easing.linear),
})<{ showPageNumber: boolean }>`
  ${(props) => css`
    margin: ${props.theme.spacing(0, 0, props.showPageNumber ? 6 : 2, 0)};
    justify-content: center;
    align-items: center;
  `}
`;

export const OverlayPageSliderBackground = styled.View`
  ${(props) => css`
    background-color: rgba(0, 0, 0, 0.7);
    padding: ${props.theme.spacing(1)};
    border-radius: ${props.theme.borderRadius}px;
  `}
`;
