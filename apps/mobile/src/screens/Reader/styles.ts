import { Dimensions } from 'react-native';
import { createStyles } from '@/utils/theme';

const { width, height } = Dimensions.get('window');

export const styles = createStyles((theme) => ({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    height: '100%',
    width: '100%',
  },
  page: {
    width,
    height,
    resizeMode: 'contain',
  },
  overlay: {
    backgroundColor: theme.palette.readerOverlay,
    padding: theme.style.size.s,
    flexDirection: 'row',
    gap: theme.style.size.s,
    alignItems: 'center',
  },
}));
