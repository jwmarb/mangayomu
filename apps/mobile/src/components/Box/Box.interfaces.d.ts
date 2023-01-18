import React from 'react';
import { ViewStyle } from 'react-native';
import { ButtonColors, Spacing, BackgroundColor } from '@mangayomu/theme';

type P = ViewStyle[''];

export interface BoxProps extends React.PropsWithChildren {
  /**
   * Layout
   */
  flex: boolean;
  'flex-grow': boolean;
  'flex-shrink': boolean;
  'justify-content': ViewStyle['justifyContent'];
  'align-items': ViewStyle['alignItems'];
  'align-self': ViewStyle['alignSelf'];
  /**
   * Decorating
   */
  'background-color': BackgroundColor | ButtonColors;
  /**
   * Padding/Margin
   */
  p: Spacing;
  m: Spacing;
  px: Spacing;
  pv: Spacing;
  mx: Spacing;
  mv: Spacing;
  ml: Spacing;
  mr: Spacing;
  mb: Spacing;
  mt: Spacing;
  pl: Spacing;
  pr: Spacing;
  pt: Spacing;
  pb: Spacing;
}
