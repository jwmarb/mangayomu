import { rem } from '@theme/Typography';
import { Dimensions } from 'react-native';
import styled, { css } from 'styled-components/native';
export const ChapterContainer = styled.View<{ width: number }>`
  ${(props) => {
    const { width } = props;

    return css`
      padding: ${props.theme.spacing(1, 3)};
      height: ${rem(60)};
      width: ${width ?? Dimensions.get('window').width}px;
      background-color: ${props.theme.palette.background.default.get()};
      justify-content: center;
    `;
  }}
`;
