import { Animated } from 'react-native';
import styled, { css } from 'styled-components/native';

export const MangaViewerContainer = styled.View`
  ${(props) => css`
    padding: ${props.theme.spacing(3)};
    background-color: ${props.theme.palette.background.default.get()};
  `}
`;
