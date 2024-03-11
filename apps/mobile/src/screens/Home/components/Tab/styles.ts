import { createStyles } from '@/utils/theme';

export const styles = createStyles((theme) => ({
  pressable: {
    flexGrow: 1,
  },
  container: {
    paddingVertical: theme.style.size.m,
    paddingHorizontal: theme.style.size.s,
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 1,
    gap: theme.style.size.s,
  },
  icon: {
    paddingVertical: theme.style.size.s,
    paddingHorizontal: theme.style.size.xl,
    borderRadius: theme.style.borderRadius,
  },
}));
