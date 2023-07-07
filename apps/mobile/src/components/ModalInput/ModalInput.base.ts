import styled, { css } from '@emotion/native';
import { verticalScale } from 'react-native-size-matters';

export const ModalInputBase = styled.TextInput`
  ${({ theme }) => css`
    color: ${theme.palette.text.primary};
    padding-horizontal: ${verticalScale(16) + 'px'};
    padding-vertical: ${verticalScale(6) + 'px'};
    ${theme.typography.body};
    background-color: ${theme.mode === 'light'
      ? 'rgba(0, 0, 0, 0.1)'
      : 'rgba(255, 255, 255, 0.1)'};
  `}
`;
