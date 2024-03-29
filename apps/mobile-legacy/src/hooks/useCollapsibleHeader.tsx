import Box from '@components/Box';
import { BoxProps } from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import { IconButtonProps } from '@components/IconButton';
import LoadingBar from '@components/LoadingBar';
import { NAVHEADER_HEIGHT, useNavStyles } from '@components/NavHeader';
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
  ViewStyle,
} from 'react-native';
import { NativeSyntheticEvent } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  runOnUI,
  useAnimatedReaction,
  useAnimatedScrollHandler,
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
  showBackButton?: boolean;
  showHeaderRight?: boolean;
  showHeaderLeft?: boolean;
  headerRightProps?: BoxProps;
  headerLeftProps?: BoxProps;
  headerLeft?: React.ReactNode;
  header?: React.ReactNode;
  onScroll?: (e: NativeScrollEvent) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  backButtonStyle?: any;
  loading?: boolean;
}

const CollapsibleBase = React.memo<
  {
    style: StyleProp<ViewStyle>;
    routeName: string;
  } & Omit<CollapsibleHeaderOptions, 'dependencies'>
>(
  ({
    style,
    routeName,
    headerRight,
    headerTitle = routeName,
    backButtonColor = 'textPrimary',
    showBackButton,
    backButtonStyle,
    backButtonRippleColor,
    header = (
      <Box justify-content="center" flex-grow>
        <Text variant="header" bold numberOfLines={1}>
          {headerTitle}
        </Text>
      </Box>
    ),
    headerLeft,
    headerLeftProps = { 'justify-content': 'center' },
    headerRightProps = { 'flex-grow': true, 'justify-content': 'center' },
    showHeaderRight,
    showHeaderLeft = true,
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
          {showHeaderLeft && (
            <Box {...headerLeftProps}>
              <Box ml="m" flex-direction="row">
                {headerLeft ||
                  (showBackButton && (
                    <IconButton
                      color={backButtonColor}
                      rippleColor={backButtonRippleColor}
                      animated={!!backButtonStyle}
                      icon={
                        <Icon
                          type="font"
                          name="arrow-left"
                          style={backButtonStyle}
                        />
                      }
                      onPress={() => {
                        if (navigation.canGoBack()) navigation.goBack();
                      }}
                    />
                  ))}
              </Box>
            </Box>
          )}
          {header}
          {showHeaderRight && (
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

export default function useCollapsibleHeader(
  options: CollapsibleHeaderOptions = {},
) {
  const {
    headerRight,
    headerTitle,
    backButtonColor,
    backButtonStyle,
    backButtonRippleColor,
    loading = false,
    dependencies = [],
    showBackButton = true,
    headerLeftProps,
    headerRightProps,
    showHeaderRight = true,
    header,
    headerLeft,
    showHeaderLeft,
    onScroll: extendedOnScroll,
  } = options;
  const theme = useTheme();
  const navigation = useRootNavigation();
  const translateY = useSharedValue(0);
  const scrollPosition = useSharedValue(0);
  const NavStyles = useNavStyles();
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

  const onScroll = useAnimatedScrollHandler((event) => {
    const {
      velocity,
      contentOffset: { y },
    } = event;
    scrollPosition.value = y;
    if (velocity && y > 0)
      translateY.value = Math.max(
        -NAVHEADER_HEIGHT,
        Math.min(translateY.value - 2.5 * velocity.y, 0),
      );
    else translateY.value = 0;
    if (extendedOnScroll) runOnJS(extendedOnScroll)(event);
  });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
    backgroundColor: backgroundColor.value,
    height: NAVHEADER_HEIGHT,
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
        <>
          <CollapsibleBase
            style={animatedHeaderStyle}
            routeName={route.name}
            headerRight={headerRight}
            header={header}
            headerTitle={headerTitle}
            backButtonColor={backButtonColor}
            backButtonStyle={backButtonStyle}
            backButtonRippleColor={backButtonRippleColor}
            loading={loading}
            showBackButton={showBackButton}
            headerLeftProps={headerLeftProps}
            headerRightProps={headerRightProps}
            showHeaderRight={showHeaderRight}
            headerLeft={headerLeft}
            showHeaderLeft={showHeaderLeft}
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
    scrollOffset: scrollPosition,
  };
}
