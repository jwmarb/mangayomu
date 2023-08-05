import { register } from 'react-native-bundle-splitter';
export default register({ loader: () => import('./Dialog') });
import type { ButtonProps } from '@components/Button';

export interface DialogAction {
  text: string;
  type?: 'destructive' | 'normal';
  variant?: ButtonProps['variant'];
  onPress?: () => void;
}

export interface DialogOptions {
  title?: string;
  message: string;
  actions?: DialogAction[];
}

export interface DialogMethods {
  open: (options: DialogOptions) => void;
}
