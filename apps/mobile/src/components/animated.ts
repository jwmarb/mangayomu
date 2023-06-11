import { FlashList } from '@shopify/flash-list';
import Animated from 'react-native-reanimated';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList,
) as unknown as FlashList<any>;
