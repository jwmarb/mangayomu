/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { RadioGroupProps } from './RadioGroup.interfaces';

const RadioContext = React.createContext<{
  onChange: (val: any) => void;
  value: any;
}>({} as any);

export const useRadioGroup = () => React.useContext(RadioContext);

const RadioGroup: React.FC<RadioGroupProps> = (props) => {
  const { value, onChange, children } = props;
  return (
    <RadioContext.Provider value={{ value, onChange }}>
      {children}
    </RadioContext.Provider>
  );
};

export default RadioGroup;
