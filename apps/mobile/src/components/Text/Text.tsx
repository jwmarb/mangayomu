import { getOrUseCustomColor } from '@components/Text/Text.helpers';
import styled, { css } from '@emotion/native';
import 'react';
import Animated from 'react-native-reanimated';
import { TextProps } from './';

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
      contrast = false,
    } = props;
    return css`
      ${variant !== 'inherit' && theme.typography[variant]}
      ${variant !== 'inherit' &&
      color !== 'inherit' &&
      `color: ${
        contrast
          ? theme.helpers.getContrastText(getOrUseCustomColor(theme, color))
          : getOrUseCustomColor(theme, color)
      }`};
      text-align: ${align};
      ${bold && 'font-weight: bold'};
      ${italic && 'font-style: italic'};
      ${underline && 'text-decoration-line: underline'};
    `;
  }}
`;

export const AnimatedText = Animated.createAnimatedComponent(Text);

export default Text;
