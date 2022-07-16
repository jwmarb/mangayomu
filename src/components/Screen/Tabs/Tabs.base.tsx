import store from '@redux/store';
import { Constants } from '@theme/core';
import { Platform, TouchableNativeFeedback } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styled, { css } from 'styled-components/native';
import { Orientation } from 'expo-screen-orientation';
import { shadowDrop } from '@theme/core';

export const TabsContainer = styled.View.attrs<{ deviceOrientation: Orientation }>((props) => {
  switch (props.deviceOrientation) {
    case Orientation.LANDSCAPE_LEFT:
    case Orientation.LANDSCAPE_RIGHT:
      return shadowDrop;
    default:
      return {};
  }
})<{ deviceOrientation: Orientation }>`
  ${(props) => {
    switch (props.deviceOrientation) {
      case Orientation.LANDSCAPE_LEFT:
      case Orientation.LANDSCAPE_RIGHT:
        return css`
          position: absolute;
          bottom: ${props.theme.spacing(2)};
          background-color: ${props.theme.palette.background.paper.get()};
          flex-direction: row;
          justify-content: space-between;
          max-width: 70%;
          align-self: center;
          border-radius: 1000px;
        `;
      default:
        return css`
          background-color: ${props.theme.palette.background.paper.get()};
          display: flex;
          position: absolute;
          bottom: 0px;
          flex-direction: row;
          justify-content: space-between;
        `;
    }
  }}
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
