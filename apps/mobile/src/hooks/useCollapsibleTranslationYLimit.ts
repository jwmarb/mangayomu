import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HEADER_HEIGHT } from '@/components/composites/types';

export default function useCollapsibleTranslationYLimit() {
  const insets = useSafeAreaInsets();

  return -insets.top - HEADER_HEIGHT;
}
