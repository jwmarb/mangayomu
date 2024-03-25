import { createStyles } from '@/utils/theme';

export const styles = createStyles(() => ({
  headerCenter: {
    flexGrow: 1,
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  headerLeft: {
    flexGrow: 1,
  },
}));
