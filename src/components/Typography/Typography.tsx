import { TypographyProps } from '@components/Typography/Typography.interfaces';
import styled, { css } from 'styled-components/native';
import { Color } from '@theme/core';

export const Typography = styled.Text<TypographyProps>`
  ${(props) => css`
    color: ${() => {
      if (props.color == null) return props.theme.palette.text.primary.get();
      if (props.color instanceof Color) return props.color.get();
      switch (props.color) {
        case 'textPrimary':
          return props.theme.palette.text.primary.get();
        case 'textSecondary':
          return props.theme.palette.text.secondary.get();
        default:
          return props.theme.palette[props.color].get();
      }
    }};
    ${props.theme.typography[props.variant ?? 'body1']};
  `}
`;
