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
  h4: {
    fontSize: 20,
    fontWeight: '400',
    letterSpacing: -0.2,
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
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  'bottom-tab': {
    fontSize: 12,
    fontWeight: 'normal',
    letterSpacing: 0.1,
  },
  chip: {
    fontSize: 13,
    fontWeight: 'normal',
    letterSpacing: 0.15,
  },
});

export const colors = (colorType: 'main' | 'light' | 'dark') =>
  createStyles<Record<TextColors, TextStyle>>((theme) => ({
    primary: {
      color: theme.palette.primary[colorType],
    },
    secondary: {
      color: theme.palette.secondary[colorType],
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
      color: theme.palette.error[colorType],
    },
    warning: {
      color: theme.palette.warning[colorType],
    },
    success: {
      color: theme.palette.success[colorType],
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

export const decorators = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
});
