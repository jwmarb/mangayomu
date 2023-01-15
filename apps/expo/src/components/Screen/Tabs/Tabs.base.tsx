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
          overflow: hidden;
          border-radius: 1000px;
        `;
      default:
        return css`
          background-color: ${props.theme.palette.background.paper.get()};
          display: flex;
          position: absolute;
          overflow: hidden;
          bottom: 0px;
          flex-direction: row;
          justify-content: space-between;
        `;
    }
  }}
`;
