import { SPACE_MULTIPLIER } from '@theme/Spacing';
import { StatusBar } from 'react-native';
import styled, { css } from 'styled-components/native';

export const HeaderBaseContainer = styled.View`
  ${(props) => css`
    padding-top: ${StatusBar.currentHeight
      ? props.theme.spacing(StatusBar.currentHeight / SPACE_MULTIPLIER + 2)
      : props.theme.spacing(2)};
    background-color: ${props.theme.palette.background.paper.get()};
    padding-horizontal: ${props.theme.spacing(2)};
    padding-bottom: ${props.theme.spacing(2)};
  `}
`;
