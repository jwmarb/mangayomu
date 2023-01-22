import { ButtonColors } from '@mangayomu/theme';
import React from 'react';
import { BaseButtonProps } from 'react-native-gesture-handler';

export interface ButtonProps extends React.PropsWithChildren, BaseButtonProps {
  label: string;
  variant?: 'contained' | 'outline' | 'text';
  color?: ButtonColors;
}
