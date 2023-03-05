import { Colors } from '@mangayomu/theme';
import React from 'react';

export interface SliderProps extends React.PropsWithChildren {
  onChange?: (val: number) => void;
  min?: number;
  max?: number;
  color?: Colors;
  defaultValue?: number;
}

export interface SliderMethods {
  setValue: (val: number) => void;
}
