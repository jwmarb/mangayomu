import { HEADER_HEIGHT } from '@/components/composites/types';
import { createStyles } from '@/utils/theme';

export const styles = createStyles((theme) => ({
  contentContainerStyle: {
    paddingHorizontal: theme.style.screen.paddingHorizontal,
    paddingBottom: theme.style.screen.paddingVertical,
    paddingTop: HEADER_HEIGHT + theme.style.screen.paddingVertical,
  },
}));
