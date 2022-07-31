import { Dimensions, StatusBar } from 'react-native';
import styled, { css } from 'styled-components/native';

export const ReaderWrapper = styled.View`
  ${() => {
    const { width, height } = Dimensions.get('window');
    return css`
      display: flex;
      flex-direction: column;
      min-height: ${height}px;
      width: ${width}px;
      justify-content: center;
    `;
  }}
`;

export const ReaderGestureContainer = styled.View`
  ${() => {
    const { width, height } = Dimensions.get('window');
    return css`
      position: absolute;
      right: 0;
      left: 0;
      top: 0;
      bottom: 0;
      width: ${width}px;
      height: ${height}px;
      z-index: 1000;
      flex-grow: 1;
    `;
  }}
`;

export const ReaderGestureScreenFiller = styled.View.attrs({ pointerEvents: 'box-only' })`
  ${() => {
    const { width, height } = Dimensions.get('window');
    return css`
      width: ${width}px;
      height: ${height}px;
      /* background-color: red; */
    `;
  }}
`;
