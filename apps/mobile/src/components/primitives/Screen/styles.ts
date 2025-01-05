import { HEADER_HEIGHT } from '@/components/composites/types';
import { createStyles } from '@/utils/theme';

export const styles = createStyles((theme) => ({
  contentContainerStyle: {
    paddingBottom: HEADER_HEIGHT + theme.style.screen.paddingVertical,
    paddingTop: HEADER_HEIGHT + theme.style.screen.paddingVertical,
  },
  contentContainerStyleIgnoreHeading: {
    paddingBottom: theme.style.screen.paddingVertical,
  },
}));
