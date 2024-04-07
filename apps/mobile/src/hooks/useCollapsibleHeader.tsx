import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  interpolateColor,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleProp, ViewStyle } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/screens/navigator';
import Header from '@/components/composites/Header';
import useTheme from '@/hooks/useTheme';
import { HEADER_HEIGHT } from '@/components/composites/types';
import { AnimatedHeaderComponentProps } from '@/components/composites/Header/Header';
import useCollapsibleTranslationYLimit from '@/hooks/useCollapsibleTranslationYLimit';
import useCollapsibleBackgroundInterpolation from '@/hooks/useCollapsibleBackgroundInterpolation';

export type CollapsibleHeaderOptions = {
  headerLeft?:
    | React.ReactNode
    | ((props: AnimatedHeaderComponentProps) => JSX.Element);
  headerLeftStyle?: StyleProp<ViewStyle>;
  showHeaderLeft?: boolean;
  headerRight?:
    | React.ReactNode
    | ((props: AnimatedHeaderComponentProps) => JSX.Element);
  showHeaderRight?: boolean;
  headerRightStyle?: StyleProp<ViewStyle>;
  headerCenter?:
    | React.ReactNode
    | ((props: AnimatedHeaderComponentProps) => JSX.Element);
  headerCenterStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  showBackButton?: boolean;
  showHeaderCenter?: boolean;
  title?: string;
  disableCollapsing?: boolean;
  shrinkLeftAndRightHeaders?: boolean;
  loading?: boolean;
};

export default function useCollapsibleHeader(
  options?: CollapsibleHeaderOptions,
  dependencies: React.DependencyList = [],
) {
  const theme = useTheme();

  const TRANSLATE_Y_HIDDEN_THRESHOLD = useCollapsibleTranslationYLimit();
  const BACKGROUND_INTERPOLATION_INPUT =
    useCollapsibleBackgroundInterpolation();
  const BACKGROUND_INTERPOLATION = [
    'transparent',
    theme.palette.background.paper,
  ] as const;

  const scrollPosition = useSharedValue(0);

  const translateY = useSharedValue(0);
  const translateYStatic = useDerivedValue(() => 0);
  const backgroundColor = useDerivedValue(() =>
    interpolateColor(
      scrollPosition.value,
      BACKGROUND_INTERPOLATION_INPUT,
      BACKGROUND_INTERPOLATION,
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
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      header: (props) => (
        <Header
          {...props}
          {...options}
          translateY={
            options?.disableCollapsing ? translateYStatic : translateY
          }
          backgroundColor={backgroundColor}
          scrollOffset={scrollPosition}
        />
      ),
    });
  }, dependencies);
  return { onScroll };
}
