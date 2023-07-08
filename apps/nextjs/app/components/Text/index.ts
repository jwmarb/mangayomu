import Text from './Text';
export default Text;
import React from 'react';
import type {
  ButtonColor,
  ButtonContrastColors,
  TextColor,
  TextVariant,
} from '@app/theme';

export type TextComponentType =
  | 'label'
  | 'p'
  | 'span'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'a';

export interface TextProps<T extends TextComponentType>
  extends React.HTMLProps<
    T extends 'label'
      ? HTMLLabelElement
      : T extends 'p'
      ? HTMLParagraphElement
      : T extends 'span'
      ? HTMLSpanElement
      : T extends 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      ? HTMLHeadingElement
      : T extends 'a'
      ? HTMLAnchorElement
      : HTMLParagraphElement
  > {
  variant?: TextVariant;
  component?: TextComponentType;
  color?: TextColor | ButtonColor | ButtonContrastColors;
}
