import { ButtonColorsTextContrasts } from '@mangayomu/theme';
import { Colors } from '@mangayomu/theme';
import { TextVariants } from '@theme/theme';
import React from 'react';
import { TextProps as NativeTextProps, TextStyle } from 'react-native';

export interface TextProps extends React.PropsWithChildren, NativeTextProps {
  variant?: TextVariants | 'inherit';
  color?:
    | Colors
    | ButtonColorsTextContrasts
    | 'inherit'
    // eslint-disable-next-line @typescript-eslint/ban-types
    | (string & {});
  contrast?: boolean;
  align?: TextStyle['textAlign'];
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}
