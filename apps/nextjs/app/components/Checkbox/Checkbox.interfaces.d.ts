import React from 'react';
import { AriaCheckboxProps } from 'react-aria';

export interface CheckboxProps
  extends React.PropsWithChildren,
    AriaCheckboxProps,
    React.HTMLProps<HTMLInputElement> {}
