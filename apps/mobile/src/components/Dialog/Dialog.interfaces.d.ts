import { ButtonProps } from '@components/Button/Button.interfaces';
import React from 'react';

export interface DialogAction {
  text: string;
  type?: 'destructive' | 'normal';
  variant?: ButtonProps['variant'];
  onPress?: () => void;
}

export interface DialogOptions {
  title?: string;
  message: string;
  actions?: DialogAction[];
}

export interface DialogMethods {
  open: (options: DialogOptions) => void;
}
