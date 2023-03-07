import React from 'react';
import { SharedValue } from 'react-native-reanimated';

export interface FontSizeProps {
  fontSize: SharedValue<number>;
  onChangeFontSize: (val: number) => void;
}
