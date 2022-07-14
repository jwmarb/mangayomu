import React from 'react';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';

export interface ItemDropdownProps {
  title: string;
  items: MenuItemProps[];
  subtitle: string;
  icon?: React.ReactNode;
}
