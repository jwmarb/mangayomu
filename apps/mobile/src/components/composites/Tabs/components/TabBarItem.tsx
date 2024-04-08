import {
  PressableAndroidRippleConfig,
  useWindowDimensions,
} from 'react-native';
import {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import React from 'react';
import { Pressable } from 'react-native';
import { AnimatedText } from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import useTheme from '@/hooks/useTheme';
import useThemedProps from '@/hooks/useThemedProps';
import { createStyles, createThemedProps } from '@/utils/theme';

type TabBarItemProps = {
  numOfRoutes: number;
  jumpTo: (key: string) => void;
  routeTitle?: string;
  routeKey: string;
  focused: boolean;
};

const themedProps = createThemedProps((theme) => ({
  android_ripple: {
    color: theme.palette.primary.main,
    borderless: true,
  } as PressableAndroidRippleConfig,
}));

const styles = createStyles((theme) => ({
  text: {
    margin: theme.style.size.xl,
  },
}));

function TabBarItem(props: TabBarItemProps) {
  const { numOfRoutes, routeTitle, focused, jumpTo, routeKey } = props;
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const contrast = useContrast();
  const { android_ripple } = useThemedProps(themedProps, contrast);
  const color = useDerivedValue(() =>
    interpolateColor(
      focused ? 1 : 0,
      [0, 1],
      [theme.palette.text.secondary, theme.palette.primary.main],
    ),
  );
  const style = useStyles(styles, contrast);
  const animatedStyle = useAnimatedStyle(() => ({
    color: color.value,
  }));
  const pressableStyle = { width: width / numOfRoutes };
  const textStyle = [style.text, animatedStyle];
  function handleOnPress() {
    jumpTo(routeKey);
  }

  return (
    <Pressable
      android_ripple={android_ripple}
      onPress={handleOnPress}
      style={pressableStyle}
    >
      <AnimatedText variant="button" bold alignment="center" style={textStyle}>
        {routeTitle}
      </AnimatedText>
    </Pressable>
  );
}

export default React.memo(TabBarItem);
