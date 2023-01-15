import React from 'react';

export interface ButtonProps extends React.PropsWithChildren<React.HTMLProps<HTMLButtonElement>> {
  isSelected?: boolean;
}
