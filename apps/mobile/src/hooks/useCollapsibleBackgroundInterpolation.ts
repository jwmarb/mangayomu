import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HEADER_HEIGHT } from '@/components/composites/types';

export default function useCollapsibleBackgroundInterpolation() {
  const insets = useSafeAreaInsets();
  const BACKGROUND_TRANSPARENCY_THRESHOLD = HEADER_HEIGHT + insets.top;
  return [0, BACKGROUND_TRANSPARENCY_THRESHOLD * 0.5] as const;
}
