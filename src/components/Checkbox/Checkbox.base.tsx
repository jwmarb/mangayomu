import { Constants } from '@theme/core';
import Animated from 'react-native-reanimated';
import styled, { css } from 'styled-components/native';

export const CheckboxBorder = styled(Animated.View)`
  ${(props) => css`
    border: 2px solid ${Constants.GRAY[props.theme.palette.mode === 'light' ? 8 : 6].get()};
    border-top-left-radius: ${props.theme.borderRadius / 4}px;
    border-top-right-radius: ${props.theme.borderRadius / 4}px;
    border-bottom-left-radius: ${props.theme.borderRadius / 4}px;
    border-bottom-right-radius: ${props.theme.borderRadius / 4}px;
  `}
`;

export const CheckboxContainer = styled.View`
  ${(props) => css`
    padding: ${props.theme.spacing(1.5)};
  `}
`;
