import React from 'react';

export interface CustomizationSliderProps {
  value: number;
  setValue: (n: number) => void;
  title: string;
  description: string;
  left: React.ReactElement<any>;
  right: React.ReactElement<any>;
  range: [number, number];
}
