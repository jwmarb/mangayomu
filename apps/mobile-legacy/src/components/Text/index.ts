import BaseText from './Text';
import Skeleton from './Text.skeleton';
const Text = BaseText as typeof BaseText & { Skeleton: typeof Skeleton };
Text.Skeleton = Skeleton;
export default Text;
export { AnimatedText } from './Text';
import { ButtonColorsTextContrasts } from '@mangayomu/theme';
import { Colors } from '@mangayomu/theme';
import { TextVariants } from '@theme/theme';
import React from 'react';
import { TextProps as NativeTextProps, TextStyle } from 'react-native';
export * from './Text.helpers';

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
