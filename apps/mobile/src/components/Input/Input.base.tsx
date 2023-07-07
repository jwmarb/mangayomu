import { setwandh } from '@components/Box/Box.helpers';
import { InputProps } from '@components/Input/Input.interfaces';
import styled, { css } from '@emotion/native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

export const InputBase = styled.TextInput<InputProps>`
  ${({ theme, width, maxWidth, icon, iconButton, expanded }) => css`
    color: ${theme.palette.text.primary};
    border-radius: ${theme.style.borderRadius + 'px'};
    border-width: 1.5px;
    border-color: ${theme.palette.borderColor};
    padding-horizontal: ${verticalScale(16) + 'px'};
    padding-vertical: ${verticalScale(6) + 'px'};
    ${theme.typography.body};
    background-color: ${theme.mode === 'light'
      ? 'rgba(0, 0, 0, 0.1)'
      : 'rgba(255, 255, 255, 0.1)'};
    ${maxWidth && setwandh('max-width', maxWidth)};
    ${width && setwandh('width', width)};
    padding-right: ${moderateScale(48) + 'px'};
    ${(icon || iconButton) &&
    css`
      padding-left: ${moderateScale(48) + 'px'};
    `};
    ${expanded && 'flex-grow: 1'};
    z-index: -1000;
  `}
`;
