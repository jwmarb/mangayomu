import { Dimensions } from 'react-native';
import styled, { css } from 'styled-components/native';

export const ListItemBase = styled.View`
  flex-grow: 1;
`;

export const ListItemSubtitleContainer = styled.View`
  max-width: 90%;
`;

export const ListAdornmentLeftContainer = styled.View`
  ${(props) => css`
    width: ${props.theme.spacing(6.5)};
  `}
`;

export const ListItemButtonBaseContainer = styled.View<{ paper: boolean }>`
  ${(props) => css`
    padding-vertical: ${props.theme.spacing(2)};
    padding-horizontal: ${props.theme.spacing(3)};
    align-items: center;
    background-color: ${props.paper
      ? props.theme.palette.background.paper.get()
      : props.theme.palette.background.default.get()};
    display: flex;
    flex-direction: row;
  `}
`;
