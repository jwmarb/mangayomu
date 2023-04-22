import Box from '@components/Box';
import { BoxProps } from '@components/Box/Box.interfaces';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import LoadingBar from '@components/LoadingBar';
import { NAVHEADER_HEIGHT, NavStyles } from '@components/NavHeader';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import useRootNavigation from '@hooks/useRootNavigation';
import React from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeScrollVelocity,
  StyleProp,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';
import { NativeSyntheticEvent } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  interpolateColor,
  runOnUI,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { moderateScale } from 'react-native-size-matters';

export interface CollapsibleTabHeaderOptions {
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  headerTitle?: string;
  headerCenter?: React.ReactNode;
  showHeaderCenter?: boolean;
  header?: React.ReactNode;
  showHeaderLeft?: boolean;
  showHeaderRight?: boolean;
  headerLeftProps?: BoxProps;
  headerRightProps?: BoxProps;
  /**
   * The conditions in which the header should rerender, such as a state.
   */
  dependencies?: React.DependencyList;
  loading?: boolean;
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
    header,
    showHeaderLeft,
    showHeaderRight,
    showHeaderCenter,
    headerLeftProps = {
      'flex-grow': true,
      'justify-content': 'center',
      maxWidth: '33%',
    },
    headerRightProps = {
      'flex-grow': true,
      'justify-content': 'center',
      maxWidth: '33%',
    },
  }) => {
    return (
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
          {showHeaderLeft && (headerLeft || headerRight) && (
            <Box {...headerLeftProps}>
              <Box ml="m" flex-direction="row">
                {headerLeft}
              </Box>
            </Box>
          )}
          {showHeaderCenter && (
            <Box flex-grow justify-content="center">
              {headerCenter == null ? (
                <Text variant="header" align="center" bold numberOfLines={1}>
                  {headerTitle}
                </Text>
              ) : (
                headerCenter
              )}
            </Box>
          )}
          {showHeaderRight && (headerLeft || headerRight) && (
            <Box {...headerRightProps}>
              <Box mr="m" justify-content="flex-end" flex-direction="row">
                {headerRight}
              </Box>
            </Box>
          )}
        </Stack>
      </Box>
    );
  },
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
    header,
    showHeaderLeft = true,
    showHeaderRight = true,
    showHeaderCenter = true,
    headerLeftProps,
    headerRightProps,
    loading = false,
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
    else translateY.value = 0;
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

  React.useEffect(() => {
    const p = Dimensions.addEventListener(
      'change',
      ({ window: { width, height } }) => {
        scrollPosition.value = (scrollPosition.value / height) * width;
        translateY.value = 0;
      },
    );
    return () => {
      p.remove();
    };
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: ({ route }) =>
        header ? (
          header
        ) : (
          <>
            <CollapsibleBase
              style={animatedHeaderStyle}
              routeName={route.name}
              headerLeft={headerLeft}
              headerRight={headerRight}
              headerTitle={headerTitle}
              headerCenter={headerCenter}
              showHeaderRight={showHeaderRight}
              showHeaderLeft={showHeaderLeft}
              showHeaderCenter={showHeaderCenter}
              headerLeftProps={headerLeftProps}
              headerRightProps={headerRightProps}
            />
            <LoadingBar loading={loading} />
          </>
        ),
    });
  }, [...dependencies, loading]);

  return {
    onScroll,
    scrollViewStyle: NavStyles.offset,
    contentContainerStyle: NavStyles.contentContainerStyle,
  };
}
