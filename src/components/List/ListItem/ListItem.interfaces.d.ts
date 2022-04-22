import { TypographyProps } from '@components/Typography/Typography.interfaces';
import React from 'react';

export interface ListItemProps {
  title: string;
  adornment?: React.ReactElement<any> | false;
  adornmentPlacement?: 'left' | 'right';
  onPress?: () => void;
  typographyProps?: TypographyProps;
}
