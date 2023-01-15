import { rem } from '@theme/Typography';
import styled, { css } from 'styled-components/native';

export const IconButtonBaseContainer = styled.View`
  ${(props) => css`
    width: ${rem(35)};
    align-items: center;
    justify-content: center;
    height: ${rem(35)};
  `}
`;
