import { Dimensions } from 'react-native';
import styled, { css } from 'styled-components/native';

export const MangaItemContainer = styled.View`
  ${(props) => css`
    width: ${Dimensions.get('window').width / 2}px;
    align-items: center;
    padding: ${props.theme.spacing(3)};
  `}
`;
