import { rem } from '@theme/Typography';
import { Animated } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';

export const MangaViewerContainer = styled.View`
  ${(props) => css`
    padding: ${props.theme.spacing(0, 0, 1, 0)};
    background-color: ${props.theme.palette.background.default.get()};
  `}
`;

export const MangaViewerImageBackdrop = styled.View`
  ${(props) => css`
    background-color: rgba(0, 0, 0, 0.2);
    padding: ${props.theme.spacing(4, 0, 0, 0)};
  `}
`;