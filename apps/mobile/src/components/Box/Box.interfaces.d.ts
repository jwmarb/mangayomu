import React from 'react';
import { ViewStyle } from 'react-native';
import {
  ButtonColors,
  Spacing,
  BackgroundColors,
  BackgroundColor,
} from '@mangayomu/theme';

export interface Debuggable {
  debug?: boolean;
}

export interface DimensionsModel {
  width?: number | string;
  height?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
}

export interface PositionModel {
  position?: ViewStyle['position'];
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
}

type BorderRadiusProperty<T> = {
  readonly tl?: T;
  readonly tr?: T;
  readonly bl?: T;
  readonly br?: T;
};

type BorderSideProperty<T> = {
  readonly t?: T;
  readonly l?: T;
  readonly r?: T;
  readonly b?: T;
};

export interface BorderModel {
  'border-radius'?: number | '@theme' | BorderRadiusProperty<number | '@theme'>;
  'border-color'?: string | BorderSideProperty<string>;
  'border-width'?: number | BorderSideProperty<number>;
}

export interface BoxModel {
  p?: Spacing | number;
  m?: Spacing | number;
  px?: Spacing | number;
  py?: Spacing | number;
  mx?: Spacing | number;
  my?: Spacing | number;
  ml?: Spacing | number;
  mr?: Spacing | number;
  mb?: Spacing | number;
  mt?: Spacing | number;
  pl?: Spacing | number;
  pr?: Spacing | number;
  pt?: Spacing | number;
  pb?: Spacing | number;
}

export interface FlexBoxModel {
  'flex-grow'?: boolean;
  'flex-shrink'?: boolean;
  'justify-content'?: ViewStyle['justifyContent'];
  'align-items'?: ViewStyle['alignItems'];
  'align-self'?: ViewStyle['alignSelf'];
  'flex-direction'?: ViewStyle['flexDirection'];
  'flex-wrap'?: ViewStyle['flexWrap'];
}

export interface BoxProps
  extends React.PropsWithChildren,
    BoxModel,
    FlexBoxModel,
    DimensionsModel,
    PositionModel,
    BorderModel,
    Debuggable {
  /**
   * Layout
   */

  overflow?: ViewStyle['overflow'];
  opacity?: number;

  'z-index'?: number;
  /**
   * Decorating
   */
  'background-color'?: string;
  'box-shadow'?: boolean;
}
