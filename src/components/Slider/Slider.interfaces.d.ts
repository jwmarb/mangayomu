import React from 'react';

export interface SliderProps {
  left?: React.ReactElement;
  right?: React.ReactElement;
  width: number;
  value: number;
  range: [number, number];
  onChange: (newValue: number) => void;
}
