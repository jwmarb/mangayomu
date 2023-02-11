import { ButtonColors } from '@mangayomu/theme';
import React from 'react';
import { BaseButtonProps } from 'react-native-gesture-handler';

export interface ButtonProps extends React.PropsWithChildren, BaseButtonProps {
  label: string;
  variant?: 'contained' | 'outline' | 'text';
  color?: ButtonColors;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.ReactElement<any>;
}
