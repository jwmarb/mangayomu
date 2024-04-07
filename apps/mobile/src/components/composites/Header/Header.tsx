import Animated, {
  Easing,
  SharedValue,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import Text from '@/components/primitives/Text';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import IconButton from '@/components/primitives/IconButton';
import Icon from '@/components/primitives/Icon';
import { CollapsibleHeaderOptions } from '@/hooks/useCollapsibleHeader';
import { styles } from '@/components/composites/Header/styles';
import { HEADER_LOADING_WIDTH } from '@/components/composites/Header';

export type AnimatedHeaderComponentProps = {
  translateY: SharedValue<number>;
  backgroundColor: SharedValue<string>;
  scrollOffset: SharedValue<number>;
};

export type HeaderProps = NativeStackHeaderProps &
  CollapsibleHeaderOptions &
  AnimatedHeaderComponentProps;

export default function Header(props: HeaderProps) {
  const {
    back,
    showHeaderLeft = true,
    headerLeft: HeaderLeft,
    showHeaderCenter = true,
    showHeaderRight = true,
    headerRight: HeaderRight,
    headerCenter: HeaderCenter,
    title,
    navigation,
    translateY,
    scrollOffset,
    showBackButton = true,
    backgroundColor,
    headerCenterStyle: headerCenterStyleProp,
    headerLeftStyle: headerLeftStyleProp,
    headerRightStyle: headerRightStyleProp,
    headerStyle: headerStyleProp,
    shrinkLeftAndRightHeaders = false,
    loading = false,
  } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const { width } = useWindowDimensions();
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
    transform: [{ translateY: translateY.value }],
  }));
  const loadingBarTranslateX = useSharedValue(-HEADER_LOADING_WIDTH);
  const loadingBarOpacity = useSharedValue(loading ? 1 : 0);
  const safeAreaViewStyle = [style.container, animatedStyle, headerStyleProp];
  const headerLeftStyle = [
    shrinkLeftAndRightHeaders ? style.itemShrink : style.item,
    style.headerLeft,
    headerLeftStyleProp,
  ];
  const headerCenterStyle = [style.item, headerCenterStyleProp];
  const headerRightStyle = [
    shrinkLeftAndRightHeaders ? style.itemShrink : style.item,
    headerRightStyleProp,
  ];
  const loadingBarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: loadingBarTranslateX.value }],
  }));
  const loadingBarContainerStyle = useAnimatedStyle(() => ({
    opacity: loadingBarOpacity.value,
  }));

  function enableLoadingAnimation(width: number) {
    loadingBarOpacity.value = withTiming(1, { duration: 100 });
    loadingBarTranslateX.value = withRepeat(
      withTiming(width, { duration: 1500, easing: Easing.sin }),
      -1,
    );
  }

  function stopLoadingAnimation() {
    loadingBarOpacity.value = withTiming(0, { duration: 100 }, (finished) => {
      if (finished) loadingBarTranslateX.value = -HEADER_LOADING_WIDTH;
    });
  }

  function handleOnBack() {
    if (navigation.canGoBack()) navigation.goBack();
  }

  React.useEffect(() => {
    if (loading) {
      enableLoadingAnimation(width);
    } else {
      stopLoadingAnimation();
    }
    return () => {
      cancelAnimation(loadingBarTranslateX);
      cancelAnimation(loadingBarOpacity);
    };
  }, [loading]);
  return (
    <>
      <Animated.View style={safeAreaViewStyle}>
        {showHeaderLeft && (
          <SafeAreaView edges={['top']} style={headerLeftStyle}>
            {showBackButton && back != null && (
              <IconButton
                icon={<Icon type="icon" name="arrow-left" />}
                onPress={handleOnBack}
              />
            )}
            {typeof HeaderLeft === 'function' ? (
              <HeaderLeft
                translateY={translateY}
                backgroundColor={backgroundColor}
                scrollOffset={scrollOffset}
              />
            ) : (
              HeaderLeft
            )}
          </SafeAreaView>
        )}
        {showHeaderCenter && (
          <SafeAreaView edges={['top']} style={headerCenterStyle}>
            {!HeaderCenter && (
              <Text
                alignment={
                  (showHeaderLeft && showHeaderRight) ||
                  (!showHeaderLeft && !showHeaderRight)
                    ? 'center'
                    : 'left'
                }
                variant="h4"
                bold
              >
                {title}
              </Text>
            )}
            {typeof HeaderCenter === 'function' ? (
              <HeaderCenter
                translateY={translateY}
                backgroundColor={backgroundColor}
                scrollOffset={scrollOffset}
              />
            ) : (
              HeaderCenter
            )}
          </SafeAreaView>
        )}
        {showHeaderRight && (
          <SafeAreaView edges={['top']} style={headerRightStyle}>
            {typeof HeaderRight === 'function' ? (
              <HeaderRight
                translateY={translateY}
                backgroundColor={backgroundColor}
                scrollOffset={scrollOffset}
              />
            ) : (
              HeaderRight
            )}
          </SafeAreaView>
        )}
      </Animated.View>
      <Animated.View style={[style.loadingContainer, loadingBarContainerStyle]}>
        <Animated.View style={[style.loadingBar, loadingBarStyle]} />
      </Animated.View>
    </>
  );
}
