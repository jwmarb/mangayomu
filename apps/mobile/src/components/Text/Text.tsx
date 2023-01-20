import styled, { css } from '@emotion/native';
import 'react';
import { TextProps } from './Text.interfaces';

const Text = styled.Text<TextProps>`
  ${(props) => {
    const {
      theme,
      variant = 'body',
      color = 'textPrimary',
      bold = false,
      italic = false,
      underline = false,
      align = 'auto',
    } = props;
    return css`
      ${theme.typography[variant]}
      color: ${theme.helpers.getColor(color)};
      text-align: ${align};
      ${bold && 'font-weight: bold'};
      ${italic && 'font-style: italic'};
      ${underline && 'text-decoration-line: underline'};
    `;
  }}
`;

export default Text;
