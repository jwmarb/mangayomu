import { ButtonColors } from '@theme/Color/Color.interfaces';
import { ButtonProps as RNButtonProps } from 'react-native';

export type ButtonVariants = 'contained' | 'outline' | 'text';

export interface ButtonProps extends Omit<RNButtonProps, 'onPress'> {
  onPress?: () => void;
  color?: ButtonColors;
  variant?: ButtonVariants;
  expand?: boolean;
}
