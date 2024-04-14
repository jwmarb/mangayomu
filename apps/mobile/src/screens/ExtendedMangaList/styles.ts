import { createStyles } from '@/utils/theme';

export const styles = createStyles((theme) => ({
  headerStyle: {
    gap: theme.style.size.s,
  },
  headerLeftStyle: {
    flexGrow: 0,
    flexShrink: 1,
  },
  headerCenterStyle: {
    alignItems: 'flex-start',
  },
  headerRightStyle: {
    flexGrow: 0,
    flexShrink: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  listHeader: {
    paddingHorizontal: theme.style.screen.paddingHorizontal,
  },
}));
