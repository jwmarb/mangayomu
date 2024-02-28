import Input from './Input';
export default Input;
import React from 'react';
import { TextInputProps } from 'react-native';

export interface InputProps extends TextInputProps {
  width?: number | string;
  maxWidth?: number | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.ReactElement<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  iconButton?: React.ReactElement<any>;
  expanded?: boolean;
  error?: boolean;
}
