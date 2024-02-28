import Progress from './Progress';
export default Progress;
import { TextProps } from '@components/Text';
import React from 'react';

export interface ProgressProps extends React.PropsWithChildren {
  color?: TextProps['color'];
  size?: 'small' | 'medium';
}
