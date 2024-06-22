import { createStyles } from '@/utils/theme';

export const styles = createStyles((theme) => ({
  item: {
    padding: theme.style.size.l,
  },
  optionsWrapper: {
    backgroundColor: theme.palette.background.menu,
    marginVertical: theme.style.size.m,
    maxHeight: 500,
    ...theme.helpers.elevation(4),
  },
  optionsContainer: {
    borderRadius: theme.style.borderRadius.m,
    backgroundColor: theme.palette.background.menu,
    overflow: 'scroll',
  },
  optionWrapper: {
    flexDirection: 'row',
    gap: theme.style.size.xl,
  },
}));
