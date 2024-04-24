import { createStyles } from '@/utils/theme';

export const styles = createStyles((theme) => ({
  container: {
    paddingHorizontal: theme.style.size.m,
    paddingVertical: theme.style.size.l,
    gap: theme.style.size.m,
  },
  icon: {
    width: 50,
    height: 50,
  },
  errorContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    gap: theme.style.size.m,
    alignItems: 'center',
  },
}));
