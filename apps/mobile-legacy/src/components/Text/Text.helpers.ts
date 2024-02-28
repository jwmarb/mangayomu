import { Theme } from '@emotion/react';
import { TextProps } from './';

export function getOrUseCustomColor(
  theme: Theme,
  color: Required<TextProps>['color'],
) {
  if (typeof color !== 'object' && theme.helpers.isPaletteColor(color)) {
    return theme.helpers.getColor(color);
  }
  if (typeof color === 'string') return color;
  return color;
}
