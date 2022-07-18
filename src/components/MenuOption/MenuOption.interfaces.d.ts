import Icon from '@components/Icon';
import { AppColors } from '@theme/Color/Color.interfaces';
import React from 'react';

export interface MenuOptionProps {
  icon?: React.ReactElement<React.ComponentProps<typeof Icon>>;
  text: string;
  value?: string | number;
  onPress?: () => void;
  color?: AppColors;
}
