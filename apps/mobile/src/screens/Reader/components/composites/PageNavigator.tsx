import Contrast from '@/components/primitives/Contrast';
import Icon from '@/components/primitives/Icon';
import IconButton from '@/components/primitives/IconButton';
import useBoolean from '@/hooks/useBoolean';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import useTheme from '@/hooks/useTheme';
import PageNumberTracker from '@/screens/Reader/components/primitives/PageNumberTracker';
import PageSlider from '@/screens/Reader/components/primitives/PageSlider';
import {
  useCurrentChapterContext,
  usePageBoundaries,
  useReaderFlatListRef,
} from '@/screens/Reader/context';
import useScrollToPage from '@/screens/Reader/hooks/useScrollToPage';
import { createStyles } from '@/utils/theme';
import React from 'react';
import { View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  FadeInDown,
  FadeOutDown,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const styles = createStyles((theme) => ({
  positioner: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  container: {
    backgroundColor: theme.palette.readerOverlay,
    padding: theme.style.size.m,
    borderRadius: theme.style.size.xxl,
    marginBottom: theme.style.size.xxl,
    marginHorizontal: theme.style.size.m,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.style.size.m,
    flex: 1,
    flexDirection: 'row',
  },
  rightNavContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export type PageNavigatorMethods = { toggle: () => void };

function PageNavigator(_: any, ref: React.ForwardedRef<PageNavigatorMethods>) {
  const opacity = useSharedValue<number>(0);
  const [isVisible, toggle] = useBoolean();
  const bottomStyle = useDerivedValue(() =>
    interpolate(opacity.value, [0, 1], [-100, 0]),
  );
  React.useImperativeHandle(ref, () => ({
    toggle() {
      toggle();
    },
  }));
  React.useEffect(() => {
    if (isVisible) {
      opacity.value = withTiming(0, { duration: 150, easing: Easing.linear });
    } else {
      opacity.value = withTiming(1, { duration: 150, easing: Easing.linear });
    }
    return () => {
      cancelAnimation(opacity);
    };
  }, [isVisible]);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    bottom: bottomStyle.value,
  }));
  const contrast = useContrast();
  const theme = useTheme();
  const { goToFirstPage, goToLastPage } = useScrollToPage();
  const style = useStyles(styles, contrast);
  function handleOnBeginning() {
    goToFirstPage();
  }
  function handleOnEnd() {
    goToLastPage();
  }
  return (
    <Contrast contrast={theme.mode === 'light'}>
      <Animated.View style={[style.positioner, animatedStyle]}>
        <View style={style.container}>
          <IconButton
            onPress={handleOnBeginning}
            icon={<Icon type="icon" name="chevron-left" />}
            size="small"
          />
          <PageSlider />
          <View style={style.rightNavContainer}>
            <PageNumberTracker />
            <IconButton
              onPress={handleOnEnd}
              icon={<Icon type="icon" name="chevron-right" />}
              size="small"
            />
          </View>
        </View>
      </Animated.View>
    </Contrast>
  );
}

export default React.memo(React.forwardRef(PageNavigator));
