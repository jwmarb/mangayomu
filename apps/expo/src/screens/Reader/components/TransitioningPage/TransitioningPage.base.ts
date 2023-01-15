import { ReaderDirection } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import { ScreenDimension } from '@utils/extra';
import { Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';

export const TransitioningPageContainer = styled.View<
  {
    readingDirection: ReaderDirection;
  } & ScreenDimension
>`
  ${(props) => {
    return css`
      width: ${props.width}px;
      height: ${props.height}px;
      align-items: center;
      justify-content: center;
    `;
  }}
`;
