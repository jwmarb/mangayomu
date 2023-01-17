import { Colors } from '@mangayomu/theme';
import { TextVariants } from '@theme/theme';
import React from 'react';
import { TextProps as NativeTextProps } from 'react-native';

export interface TextProps extends React.PropsWithChildren, NativeTextProps {
  variant?: TextVariants;
  color?: Colors;
}
