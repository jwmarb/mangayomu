import { FlashList } from '@shopify/flash-list';
import { SectionList } from 'react-native';
import Animated from 'react-native-reanimated';

type FlashListComponent = typeof FlashList;
type SectionListComponent = typeof SectionList;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList,
) as unknown as FlashListComponent;

export const AnimatedSectionList = Animated.createAnimatedComponent(
  SectionList,
) as SectionListComponent;
