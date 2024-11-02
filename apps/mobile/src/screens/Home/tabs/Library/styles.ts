import { createStyles } from '@/utils/theme';

export const styles = createStyles((theme) => ({
  headerRightStyle: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRightStyleWithTextInput: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    flexGrow: 0,
  },
  headerLeftStyle: {
    maxWidth: '82%',
  },
  headerStyle: {
    gap: theme.style.size.m,
    maxWidth: '100%',
  },
}));
