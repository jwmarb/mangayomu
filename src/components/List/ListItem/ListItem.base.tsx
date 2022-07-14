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
