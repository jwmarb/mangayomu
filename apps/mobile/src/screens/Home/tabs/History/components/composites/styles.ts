import {
  HISTORY_ENTRY_HEIGHT,
  HISTORY_ENTRY_IMAGE_COVER_HEIGHT,
} from '@/screens/Home/tabs/History/components/composites';
import { createStyles } from '@/utils/theme';

export const styles = createStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.style.size.m,
  },
  imageCover: {
    width: '20%',
    height: HISTORY_ENTRY_IMAGE_COVER_HEIGHT,
  },
  information: {
    width: '80%',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
}));
