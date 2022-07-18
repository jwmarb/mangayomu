import { Dimensions } from 'react-native';
import styled, { css } from 'styled-components/native';
export const ChapterContainer = styled.View`
  ${(props) => {
    const { width } = Dimensions.get('window');

    return css`
      padding: ${props.theme.spacing(1, 3)};
      width: ${width}px;
      background-color: ${props.theme.palette.background.default.get()};
    `;
  }}
`;
