import styled, { css } from 'styled-components/native';
import { Constants } from '@theme/core';
import { Platform } from 'react-native';
import { TouchableOpacity, TouchableNativeFeedback } from 'react-native-gesture-handler';

export const TabWrapper = styled.View`
  ${(props) => css`
    flex-grow: 1;
  `}
`;

export const TabContainer = styled.View`
  ${(props) => css`
    padding: ${props.theme.spacing(2)};
    align-items: center;
    justify-content: center;
    flex-grow: 1;
  `}
`;

export const TabButtonBase = styled(Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback).attrs(
  (props) => {
    if (Platform.OS === 'ios') {
      return {
        activeOpacity: 0.5,
      };
    }
    return {
      background: TouchableNativeFeedback.Ripple(
        props.theme.palette.primary[props.theme.palette.mode ?? 'light'].get(),
        true
      ),
    };
  }
)``;
