import { rem } from '@theme/Typography';
import styled, { css } from 'styled-components/native';

export const IconButtonBaseContainer = styled.View`
  ${(props) => css`
    padding: ${props.theme.spacing(1)};
    width: 48px;
    align-items: center;
    justify-content: center;
    height: 48px;
  `}
`;
