import { createStyles } from '@/utils/theme';

export const styles = createStyles((theme) => ({
  horizontal: {
    flexGrow: 1,
    height: 1.5,
    backgroundColor: theme.palette.divider,
  },
  vertical: {
    flexGrow: 1,
    width: 1.5,
    backgroundColor: theme.palette.divider,
  },
}));
