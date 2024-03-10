import { HEADER_HEIGHT } from '@/components/composites/types';
import { createStyles } from '@/utils/theme';

export const styles = createStyles((theme) => ({
  container: {
    flexShrink: 1,
    flexDirection: 'row',
    paddingHorizontal: theme.style.screen.paddingHorizontal,
    height: HEADER_HEIGHT,
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    justifyContent: 'center',
  },
  headerLeft: {
    gap: theme.style.size.s,
  },
}));
