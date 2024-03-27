import { ChipColors } from '@/components/primitives/types';
import { createStyles } from '@/utils/theme';

export const styles = (color: ChipColors | 'null') =>
  createStyles((theme) => ({
    chip_outlined: {
      borderColor:
        color === 'null' ? theme.palette.divider : theme.palette[color].main,
      borderRadius: theme.style.borderRadius / 3,
      borderWidth: 1.5,
      flexDirection: 'row',
      overflow: 'hidden',
    },
    chip_filled: {
      backgroundColor:
        color === 'null'
          ? theme.palette.divider
          : theme.palette[color][theme.mode === 'dark' ? 'dark' : 'light'],
      borderRadius: theme.style.borderRadius / 3,
      borderWidth: 1.5,
      flexDirection: 'row',
      overflow: 'hidden',
    },
    chipPressable: {
      flex: 0,
      flexDirection: 'row',
      paddingVertical: theme.style.size.m,
      paddingHorizontal: theme.style.size.l,
      alignItems: 'center',
      gap: theme.style.size.s,
    },
  }));
