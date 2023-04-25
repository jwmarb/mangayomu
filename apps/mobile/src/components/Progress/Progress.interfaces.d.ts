import { TextProps } from '@components/Text/Text.interfaces';
import React from 'react';

export interface ProgressProps extends React.PropsWithChildren {
  color?: TextProps['color'];
  size?: 'small' | 'medium';
}
