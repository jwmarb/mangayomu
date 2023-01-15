import { AppColors } from '@theme/Color/Color.interfaces';

export type ProgressProps = SpinnerProps | BarProps;

export interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: AppColors;
  native?: boolean;
  type?: 'spinner';
}

export interface BarProps extends Omit<SpinnerProps, 'native'> {
  type?: 'bar';
}
