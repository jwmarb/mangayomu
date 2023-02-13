import Box from '@components/Box';
import Icon from '@components/Icon';
import IconButton, { generateRippleColor } from '@components/IconButton';
import { IconButtonProps } from '@components/IconButton/IconButton.interfaces';
import { NAVHEADER_HEIGHT, NavStyles } from '@components/NavHeader';
import { Stack } from '@components/Stack';
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
  interpolate,
  interpolateColor,
  runOnUI,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

export interface CollapsibleHeaderOptions {
  headerRight?: React.ReactNode;
  headerTitle?: string;
  /**
   * The conditions in which the header should rerender, such as a state.
   */
  dependencies?: React.DependencyList;
  backButtonColor?: IconButtonProps['color'];
  backButtonRippleColor?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  backButtonStyle?: any;
}

const CollapsibleBase = React.memo<
  { style: StyleProp<ViewStyle>; routeName: string } & Omit<
    CollapsibleHeaderOptions,
    'dependencies'
  >
>(
  ({
    style,
    routeName,
    headerRight,
    headerTitle = routeName,
    backButtonColor = 'textPrimary',
    backButtonStyle,
    backButtonRippleColor,
  }) => {
    const navigation = useRootNavigation();
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
        <Stack space="s" flex-direction="row">
          <Box flex-grow justify-content="center">
            <Box ml="m" flex-direction="row">
              <IconButton
                color={backButtonColor}
                rippleColor={backButtonRippleColor}
                animated={!!backButtonStyle}
                icon={
                  <Icon type="font" name="arrow-left" style={backButtonStyle} />
                }
                onPress={() => {
                  if (navigation.canGoBack()) navigation.goBack();
                }}
              />
            </Box>
          </Box>
          <Box justify-content="center" flex-grow>
            <Text variant="header" bold numberOfLines={1}>
              {headerTitle}
            </Text>
          </Box>
          <Box flex-grow justify-content="center">
            <Box mr="m" justify-content="flex-end" flex-direction="row">
              {headerRight}
            </Box>
          </Box>
        </Stack>
      </Box>
    );
  },
);

export default function useCollapsibleHeader(
  options: CollapsibleHeaderOptions = {},
) {
  const {
    headerRight,
    headerTitle,
    dependencies = [],
    backButtonColor,
    backButtonStyle,
    backButtonRippleColor,
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
      header: ({ route }) => (
        <CollapsibleBase
          style={animatedHeaderStyle}
          routeName={route.name}
          headerRight={headerRight}
          headerTitle={headerTitle}
          backButtonColor={backButtonColor}
          backButtonStyle={backButtonStyle}
          backButtonRippleColor={backButtonRippleColor}
        />
      ),
    });
  }, dependencies);

  return {
    onScroll,
    scrollViewStyle: NavStyles.offset,
    contentContainerStyle: NavStyles.contentContainerStyle,
  };
}