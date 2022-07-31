import { FontFamily } from '@theme/Typography';
import React from 'react';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';

export type ItemDropdownMenu = MenuItemProps & { fontFamily?: FontFamily; isSelected: boolean };

export interface ItemDropdownProps {
  title: string;
  items: ItemDropdownMenu[];
  subtitle: string;
  icon?: React.ReactNode;
  paper?: boolean;
}
