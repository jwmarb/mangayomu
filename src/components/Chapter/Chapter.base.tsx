import { Dimensions } from 'react-native';
import styled, { css } from 'styled-components/native';
const { width } = Dimensions.get('window');
export const ChapterContainer = styled.View`
  ${(props) => css`
    padding: ${props.theme.spacing(1, 3)};
    width: ${width}px;
    background-color: ${props.theme.palette.background.default.get()};
  `}
`;
