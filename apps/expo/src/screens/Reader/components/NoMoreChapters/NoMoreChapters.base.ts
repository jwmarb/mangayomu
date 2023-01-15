import { ReaderDirection } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import { ScreenDimension } from '@utils/extra';
import styled, { css } from 'styled-components/native';

export const NoMoreChaptersContainer = styled.View<{ readerDirection: ReaderDirection } & ScreenDimension>`
  ${(props) => {
    return css`
      width: ${props.width}px;
      height: ${props.height}px;
      align-items: center;
      justify-content: center;
    `;
  }}
`;
