import Box from '@components/Box';
import { NAVHEADER_HEIGHT, NavStyles } from '@components/NavHeader';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import useRootNavigation from '@hooks/useRootNavigation';
import React from 'react';
import {
  NativeScrollEvent,
  NativeScrollVelocity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { NativeSyntheticEvent } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  runOnUI,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

export interface CollapsibleTabHeaderOptions {
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  headerTitle?: string;
  headerCenter?: React.ReactNode;
  /**
   * The conditions in which the header should rerender, such as a state.
   */
  dependencies?: React.DependencyList;
}

const CollapsibleBase = React.memo<
  { style: StyleProp<ViewStyle>; routeName: string } & Omit<
    CollapsibleTabHeaderOptions,
    'dependencies'
  >
>(
  ({
    style,
    routeName,
    headerCenter,
    headerLeft,
    headerRight,
    headerTitle = routeName,
  }) => (
    <Box
      as={Animated.View}
      style={style}
      position="absolute"
      flex-grow
      left={0}
      right={0}
      top={0}
      bottom={0}
      background-color="transparent"
    >
      <Stack space="s" flex-direction="row" justify-content="space-between">
        {(headerLeft || headerRight) && (
          <Box flex-grow justify-content="center" maxWidth="33%">
            <Box ml="m" flex-direction="row">
              {headerLeft}
            </Box>
          </Box>
        )}
        <Box flex-shrink justify-content="center">
          {headerCenter == null ? (
            <Text variant="header" align="center" bold>
              {headerTitle}
            </Text>
          ) : (
            headerCenter
          )}
        </Box>
        {(headerRight || headerLeft) && (
          <Box flex-grow justify-content="center" maxWidth="33%">
            <Box mr="m" justify-content="flex-end" flex-direction="row">
              {headerRight}
            </Box>
          </Box>
        )}
      </Stack>
    </Box>
  ),
);

export default function useCollapsibleTabHeader(
  options: CollapsibleTabHeaderOptions = {},
) {
  const {
    headerLeft,
    headerRight,
    headerTitle,
    headerCenter,
    dependencies = [],
  } = options;
  const theme = useTheme();
  const navigation = useRootNavigation();
  const translateY = useSharedValue(0);
  const scrollPosition = useSharedValue(0);
  const opacity = useDerivedValue(() =>
    interpolate(translateY.value, [-NAVHEADER_HEIGHT, 0], [0, 1]),
  );
  const backgroundColor = useDerivedValue(() =>
    interpolateColor(
      scrollPosition.value,
      [0, NAVHEADER_HEIGHT],
      ['transparent', theme.palette.background.default],
    ),
  );

  function velocityHandler(velocity?: NativeScrollVelocity) {
    if (velocity)
      translateY.value = Math.max(
        -NAVHEADER_HEIGHT,
        Math.min(translateY.value - 2.5 * velocity.y, 0),
      );
  }

  function scrollPositionHandler(y: number) {
    scrollPosition.value = y;
  }

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const {
      velocity,
      contentOffset: { y },
    } = e.nativeEvent;
    runOnUI(velocityHandler)(velocity);
    runOnUI(scrollPositionHandler)(y);
  }

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
    backgroundColor: backgroundColor.value,
  }));

  const animatedHeaderStyle = React.useMemo(
    () => [NavStyles.header, style],
    [style, NavStyles.header],
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ route }) => (
        <CollapsibleBase
          style={animatedHeaderStyle}
          routeName={route.name}
          headerLeft={headerLeft}
          headerRight={headerRight}
          headerTitle={headerTitle}
          headerCenter={headerCenter}
        />
      ),
    });
  }, dependencies);

  return { onScroll, scrollViewStyle: NavStyles.offset };
}