import { TextProps } from '@components/Text/Text.interfaces';
import React from 'react';

export interface MenuItemProps extends React.PropsWithChildren, TextProps {
  onPress?: () => void;
  // only use if you pass `optionKey`
  onSelect?: (optionKey: string) => void;
  optionKey?: string;
}
