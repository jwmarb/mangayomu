import React from 'react';

export interface AccordionProps {
  expand?: boolean;
  onToggle?: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
}
