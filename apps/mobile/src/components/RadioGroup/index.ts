/* eslint-disable @typescript-eslint/no-explicit-any */
import RadioGroup from './RadioGroup';
export default RadioGroup;
export { useRadioGroup } from './RadioGroup';
import React from 'react';

export interface RadioGroupProps extends React.PropsWithChildren {
  onChange: (value: any) => void;
  value: any;
}
