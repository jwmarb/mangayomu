import { Theme } from '@emotion/react';
import { TextProps } from './Text.interfaces';

export function getOrUseCustomColor(
  theme: Theme,
  color: Required<TextProps>['color'],
) {
  if (typeof color !== 'object') return theme.helpers.getColor(color);
  return color.custom;
}
