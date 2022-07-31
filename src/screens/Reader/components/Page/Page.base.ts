import { ReaderDirection } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import { Dimensions, StatusBar } from 'react-native';
import Animated from 'react-native-reanimated';
import styled, { css } from 'styled-components/native';

export const PageContainer = styled(Animated.View)<{ imageHeight?: number; width: number; height: number }>`
  ${(props) => {
    return css`
      width: ${props.width}px;
      height: ${props.imageHeight ?? props.height}px;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    `;
  }}
`;
