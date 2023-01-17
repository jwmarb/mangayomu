import styled, { css } from '@emotion/native';
import 'react';
import { TextProps } from './Text.interfaces';

const Text = styled.Text<TextProps>`
  ${(props) => {
    const { theme, variant = 'body', color = 'textPrimary' } = props;
    return css`
      ${theme.typography[variant]}
      color: ${theme.helpers.getColor(color)};
    `;
  }}
`;

export default Text;
