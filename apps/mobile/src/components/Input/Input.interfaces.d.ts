import React from 'react';
import { TextInput } from 'react-native-gesture-handler';

export interface InputProps extends React.ComponentProps<TextInput> {
  width?: number | string;
  maxWidth?: number | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.ReactElement<any>;
}
