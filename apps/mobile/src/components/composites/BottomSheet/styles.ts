import { createStyles } from '@/utils/theme';

export const styles = createStyles((theme) => ({
  backgroundStyle: {
    backgroundColor: theme.palette.background.paper,
  },
  handleIndicatorStyle: {
    backgroundColor:
      theme.palette.common[theme.mode === 'dark' ? 'white' : 'black'],
  },
}));
