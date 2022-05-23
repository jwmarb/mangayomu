import { TypographyProps } from '@components/Typography/Typography.interfaces';
import styled, { css } from 'styled-components/native';
import { Color } from '@theme/core';
import Animated from 'react-native-reanimated';

export const Typography = styled(Animated.Text)<TypographyProps>`
  ${(props) => css`
    ${props.theme.typography[props.variant ?? 'body1']};
    color: ${() => {
      if (props.color == null) return props.theme.palette.text.primary.get(props.lockTheme);
      return Color.valueOf(props.color, props.lockTheme);
    }};
    ${props.bold != null &&
    css`
      font-family: ${props.bold ? props.theme.typography.fontFamily.heavy : props.theme.typography.fontFamily.regular};
    `};
    text-align: ${props.align ?? 'left'};
    ${() =>
      props.fontSize &&
      css`
        font-size: ${props.fontSize}px;
      `}
  `}
`;
