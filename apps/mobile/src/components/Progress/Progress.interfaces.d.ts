import { TextProps } from '@components/Text/Text.interfaces';
import { ButtonColors } from '@mangayomu/theme';
import React from 'react';

export interface ProgressProps extends React.PropsWithChildren {
  color?: TextProps['color'];
  size?: 'small' | 'medium';
}
