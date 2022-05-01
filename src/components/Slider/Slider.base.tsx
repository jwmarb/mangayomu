import Animated from 'react-native-reanimated';
import styled, { css } from 'styled-components/native';

export const SliderLine = styled.View<{ width: number }>`
  ${(props) => css`
    flex-direction: row;
    display: flex;
    width: ${props.width}px;
    height: ${props.theme.spacing(1)};
    background-color: ${props.theme.palette.action.disabled.get()};
    border-top-left-radius: 1000px;
    border-top-right-radius: 1000px;
    border-bottom-right-radius: 1000px;
    border-bottom-left-radius: 1000px;
  `}
`;

export const SliderFilledLine = styled(Animated.View)`
  ${(props) => css`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    flex-direction: row;
    display: flex;
    height: ${props.theme.spacing(1)};
    background-color: ${props.theme.palette.primary.main.get()};
    border-top-left-radius: 1000px;
    border-top-right-radius: 1000px;
    border-bottom-right-radius: 1000px;
    border-bottom-left-radius: 1000px;
  `}
`;

export const SliderCircle = styled.View`
  ${(props) => css`
    border-top-left-radius: 1000px;
    border-top-right-radius: 1000px;
    border-bottom-right-radius: 1000px;
    border-bottom-left-radius: 1000px;
    background-color: ${props.theme.palette.primary.main.get()};
    padding: ${props.theme.spacing(1.5)};
    margin: ${props.theme.spacing(1)};
  `}
`;

export const SliderContainer = styled.View`
  ${(props) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
  `}
`;

export const SliderCircleBaseContainer = styled(Animated.View)`
  ${(props) => css`
    position: absolute;
    left: 0;
    top: -8px;
    bottom: 0;
    margin-left: ${props.theme.spacing(1.75)};
  `}
`;
