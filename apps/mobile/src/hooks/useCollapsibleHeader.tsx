import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  interpolateColor,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/screens/navigator';
import Header from '@/components/composites/Header';
import useTheme from '@/hooks/useTheme';
import { HEADER_HEIGHT } from '@/components/composites/types';

export type CollapsibleHeaderOptions = {
  headerLeft?: React.ReactNode;
  showHeaderLeft?: boolean;
  headerRight?: React.ReactNode;
  showHeaderRight?: boolean;
  headerCenter?: React.ReactNode;
  showHeaderCenter?: boolean;
  title?: string;
};

export default function useCollapsibleHeader(
  options?: CollapsibleHeaderOptions,
  dependencies: React.DependencyList = [],
) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const TRANSLATE_Y_HIDDEN_THRESHOLD = -insets.top - HEADER_HEIGHT;
  const BACKGROUND_TRANSPARENCY_THRESHOLD = HEADER_HEIGHT + insets.top;
  const BACKGROUND_INTERPOLATION = [
    [BACKGROUND_TRANSPARENCY_THRESHOLD, BACKGROUND_TRANSPARENCY_THRESHOLD * 2],
    ['transparent', theme.palette.background.paper],
  ] as const;

  const scrollPosition = useSharedValue(0);
  const translateY = useSharedValue(0);
  const backgroundColor = useDerivedValue(() =>
    interpolateColor(
      scrollPosition.value,
      BACKGROUND_INTERPOLATION[0],
      BACKGROUND_INTERPOLATION[1],
    ),
  );
  const onScroll = useAnimatedScrollHandler((e) => {
    'worklet';
    scrollPosition.value = e.contentOffset.y;
    if (e.velocity && e.contentOffset.y > 0) {
      translateY.value = Math.max(
        TRANSLATE_Y_HIDDEN_THRESHOLD,
        Math.min(translateY.value - 2.5 * e.velocity.y, 0),
      );
    } else translateY.value = 0;
  });
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  React.useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      header: (props) => (
        <Header
          {...props}
          {...options}
          translateY={translateY}
          backgroundColor={backgroundColor}
        />
      ),
    });
  }, dependencies);
  return { onScroll };
}
