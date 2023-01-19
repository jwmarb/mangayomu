import React from 'react';
import { ViewStyle } from 'react-native';
import { ButtonColors, Spacing, BackgroundColors } from '@mangayomu/theme';

type P = ViewStyle[''];

export interface BoxProps extends React.PropsWithChildren {
  /**
   * Layout
   */
  flex?: boolean;
  'flex-grow'?: boolean;
  'flex-shrink'?: boolean;
  'justify-content'?: ViewStyle['justifyContent'];
  'align-items'?: ViewStyle['alignItems'];
  'align-self'?: ViewStyle['alignSelf'];
  'flex-direction'?: ViewStyle['flexDirection'];
  'flex-wrap'?: ViewStyle['flexWrap'];
  width?: number | string;
  height?: number | string;
  /**
   * Decorating
   */
  'background-color'?: ButtonColors | BackgroundColors;
  'box-shadow'?: boolean;
  /**
   * Padding/Margin
   */
  p?: Spacing;
  m?: Spacing;
  px?: Spacing;
  pv?: Spacing;
  mx?: Spacing;
  mv?: Spacing;
  ml?: Spacing;
  mr?: Spacing;
  mb?: Spacing;
  mt?: Spacing;
  pl?: Spacing;
  pr?: Spacing;
  pt?: Spacing;
  pb?: Spacing;
}
