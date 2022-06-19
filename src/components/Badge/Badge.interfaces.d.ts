import { AppColors } from '@theme/Color/Color.interfaces';
import React from 'react';

export interface BadgeProps {
  badge?: React.ReactNode | number;
  color?: AppColors;
  alwaysActive?: boolean;
}
