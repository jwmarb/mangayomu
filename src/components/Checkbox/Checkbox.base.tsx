import { Constants, rem } from '@theme/core';
import Animated from 'react-native-reanimated';
import { RFValue } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';

export const CheckboxBorder = styled(Animated.View)`
  ${(props) => css`
    border-top-left-radius: ${RFValue(props.theme.borderRadius / 4)}px;
    border-top-right-radius: ${RFValue(props.theme.borderRadius / 4)}px;
    border-bottom-left-radius: ${RFValue(props.theme.borderRadius / 4)}px;
    border-bottom-right-radius: ${RFValue(props.theme.borderRadius / 4)}px;
  `}
`;

export const CheckboxContainer = styled.View`
  ${(props) => css`
    padding: ${props.theme.spacing(1.5)};
  `}
`;
