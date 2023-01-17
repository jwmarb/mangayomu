import React from 'react';
import { ButtonProps as NativeButtonProps } from 'react-native';

export interface ButtonProps
  extends React.PropsWithChildren,
    Omit<NativeButtonProps, 'title'> {
  label: string;
}
