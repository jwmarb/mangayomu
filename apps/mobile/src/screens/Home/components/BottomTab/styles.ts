import { createStyles } from '@/utils/theme';

export const styles = createStyles((theme) => ({
  container: {
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: theme.palette.background.paper,
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: theme.style.borderRadius.xxl,
    borderTopRightRadius: theme.style.borderRadius.xxl,
    maxWidth: 480,
    alignSelf: 'center',
  },
}));
