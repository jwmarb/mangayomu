import styled, { css } from 'styled-components/native';
import { Dimensions } from 'react-native';
import { rem } from '@theme/Typography';

export const MainSourceImage = styled.Image`
  ${(props) => {
    return css`
      width: ${rem(64)};
      height: ${rem(64)};
    `;
  }}
`;
