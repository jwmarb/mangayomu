import { TypographyProps } from '@components/Typography/Typography.interfaces';
import React from 'react';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';

export interface ListItemProps {
  title: string;
  subtitle?: string;
  adornment?: React.ReactElement<any> | false;
  adornmentPlacement?: 'left' | 'right';
  onPress?: () => void;
  typographyProps?: TypographyProps;
  holdItem?: MenuItemProps[];
}
