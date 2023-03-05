/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

export interface RadioGroupProps extends React.PropsWithChildren {
  onChange: (value: any) => void;
  value: any;
}
