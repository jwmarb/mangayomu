import Radio from './Radio';
export default Radio;
import React from 'react';

export interface RadioProps extends React.PropsWithChildren {
  label?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  onPress?: () => void;
}

export interface BaseRadioProps {
  isSelected: boolean;
  onChange: () => void;
  onPress?: () => void;
  label?: string;
}
