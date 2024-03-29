import { ViewStyle } from 'react-native';
import type {
  ButtonVariants,
  ButtonColors,
} from '@/components/primitives/types';
import { createStyles } from '@/utils/theme';

export const variants = (color: ButtonColors, state: 'enabled' | 'disabled') =>
  createStyles<Record<ButtonVariants, ViewStyle>>((theme) => ({
    contained: {
      backgroundColor:
        state === 'disabled'
          ? theme.palette.action.disabled
          : theme.palette[color].main,
    },
    outlined: {
      borderColor:
        state === 'disabled'
          ? theme.palette.action.disabled
          : theme.palette[color].main,
    },
    text: {},
  }));

export const styles = (variant: ButtonVariants, color: ButtonColors) =>
  createStyles((theme) => ({
    button: {
      paddingHorizontal: theme.style.size.xxl,
      paddingVertical: theme.style.size.l,
    },
    container: {
      borderWidth: 1.5,
      borderRadius: theme.style.borderRadius,
      borderColor:
        variant === 'outlined' ? theme.palette[color].main : 'transparent',
      overflow: 'hidden',
    },
    pressable: {
      gap: theme.style.size.m,
      alignItems: 'center',
      flexDirection: 'row',
    },
    text: {
      flexGrow: 1,
    },
  }));
