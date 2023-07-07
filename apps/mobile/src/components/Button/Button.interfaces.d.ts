import { ButtonColors } from '@mangayomu/theme';
import React from 'react';
import { PressableProps, StyleProp, ViewStyle } from 'react-native';

export interface ButtonProps
  extends React.PropsWithChildren,
    Omit<PressableProps, 'style'> {
  label?: string;
  variant?: 'contained' | 'outline' | 'text';
  color?: ButtonColors;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.ReactElement<any>;
  iconPlacement?: 'left' | 'right';
  sharp?: boolean;
  style?: StyleProp<ViewStyle>;
}
