import MenuItem from './MenuItem';
export default MenuItem;
import { TextProps } from '@components/Text';
import React from 'react';

export interface MenuItemProps<T> extends React.PropsWithChildren, TextProps {
  onPress?: () => void;
  // only use if you pass `optionKey`
  onSelect?: (optionKey: T) => void;
  optionKey?: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.ReactElement<any>;
}
