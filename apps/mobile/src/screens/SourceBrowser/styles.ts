import { createStyles } from '@/utils/theme';

export const styles = createStyles((theme) => ({
  headerCenter: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    gap: theme.style.size.m,
    alignItems: 'center',
    paddingBottom: theme.style.screen.paddingVertical,
  },
  headerRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: theme.style.screen.paddingVertical,
  },
  headerRightSearchBar: {
    flexGrow: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: theme.style.screen.paddingVertical,
  },
  headerCenterSearchBar: {
    paddingBottom: theme.style.screen.paddingVertical,
  },
  headerSearchBar: {
    gap: theme.style.size.m,
  },
  footer: theme.style.container,
}));
