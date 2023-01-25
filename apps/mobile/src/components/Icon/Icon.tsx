import styled, { css } from '@emotion/native';
import React from 'react';
import { IconProps } from './Icon.interfaces';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { set } from '@components/Box/Box.helpers';

const Icon = styled(MaterialCommunityIcons)<IconProps>`
  ${(props) => {
    const {
      theme,
      color = 'textPrimary',
      bold,
      italic,
      underline,
      variant = 'body',
      size,
    } = props;
    return css`
      ${variant !== 'inherit' && theme.typography[variant]};
      ${variant !== 'inherit' && `color: ${theme.helpers.getColor(color)}`};
      ${size != null && 'font-size: ' + size + 'px'};
      ${bold && 'font-weight: bold'};
      ${italic && 'font-style: italic'};
      ${underline && 'text-decoration-line: underline'};
    `;
  }}
`;
export default Icon;
