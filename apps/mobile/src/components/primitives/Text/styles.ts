import { StyleSheet, TextStyle } from 'react-native';
import {
  TextAlignments,
  TextColors,
  TextVariants,
} from '@/components/primitives/types';
import { createStyles } from '@/utils/theme';
export const variants = StyleSheet.create<Record<TextVariants, TextStyle>>({
  h1: {
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 1.68,
  },
  h2: {
    fontSize: 34,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  h3: {
    fontSize: 24,
    fontWeight: '400',
    letterSpacing: -0.16,
  },
  body1: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  body2: {
    fontSize: 14,
    fontWeight: 'normal',
    letterSpacing: 0.44,
  },
  button: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.56,
  },
});

export const colors = createStyles<Record<TextColors, TextStyle>>((theme) => ({
  primary: {
    color: theme.palette.primary.main,
  },
  secondary: {
    color: theme.palette.secondary.main,
  },
  textPrimary: {
    color: theme.palette.text.primary,
  },
  textSecondary: {
    color: theme.palette.text.secondary,
  },
  disabled: {
    color: theme.palette.text.disabled,
  },
  error: {
    color: theme.palette.error.main,
  },
}));

export const alignments = StyleSheet.create<Record<TextAlignments, TextStyle>>({
  left: {
    textAlign: 'left',
  },
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
});
