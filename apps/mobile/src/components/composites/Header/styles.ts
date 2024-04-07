import { HEADER_LOADING_WIDTH } from '@/components/composites/Header';
import { HEADER_HEIGHT } from '@/components/composites/types';
import { createStyles } from '@/utils/theme';

export const styles = createStyles((theme) => ({
  container: {
    flexShrink: 1,
    flexDirection: 'row',
    paddingHorizontal: theme.style.screen.paddingHorizontal,
    paddingVertical: theme.style.screen.paddingVertical,
    height: HEADER_HEIGHT,
    justifyContent: 'space-between',
  },
  item: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  itemShrink: {
    flexShrink: 1,
    justifyContent: 'center',
  },
  headerLeft: {
    gap: theme.style.size.s,
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 3,
    flexGrow: 1,
    backgroundColor: theme.palette.primary.ripple,
  },
  loadingBar: {
    backgroundColor: theme.palette.primary.main,
    height: 3,
    width: HEADER_LOADING_WIDTH,
  },
}));
