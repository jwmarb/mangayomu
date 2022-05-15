import { Animated } from 'react-native';
import styled, { css } from 'styled-components/native';

export const MangaViewerContainer = styled.View`
  ${(props) => css`
    padding: ${props.theme.spacing(0, 0, 3, 0)};
    background-color: ${props.theme.palette.background.default.get()};
  `}
`;

export const MangaViewerImageBackdrop = styled.View<{ paddingTop: number }>`
  ${(props) => css`
    background-color: rgba(0, 0, 0, 0.2);
    padding: ${props.theme.spacing(3 + props.paddingTop / 8, 0, 0, 0)};
  `}
`;
