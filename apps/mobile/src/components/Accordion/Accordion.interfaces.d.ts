import { StackProps } from '@components/Stack/Stack.interfaces';
import { TextProps } from '@components/Text/Text.interfaces';
import React from 'react';

export interface AccordionProps extends React.PropsWithChildren {
  title: string;
  textProps?: TextProps;
  containerProps?: StackProps;
  defaultState?: 'expanded' | 'collapsed';
}

export interface AccordionMethods {
  expand: () => void;
  collapse: () => void;
  toggle: () => void;
}
