import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs';
import { NavigationHelpers, ParamListBase } from '@react-navigation/native';
import {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import React from 'react';
import { View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import Text from '@/components/primitives/Text';
import { HomeStackParamList } from '@/screens/Home/Home';
import Pressable from '@/components/primitives/Pressable';
import useStyles from '@/hooks/useStyles';
import { styles } from '@/screens/Home/components/Tab/styles';
import useContrast from '@/hooks/useContrast';
import { AnimatedIcon } from '@/components/primitives/Icon';
import useTheme from '@/hooks/useTheme';
import { createThemedProps } from '@/utils/theme';
import useThemedProps from '@/hooks/useThemedProps';

export type TabProps = {
  routeName: keyof HomeStackParamList;
  isFocused: boolean;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
};

const icons: Record<
  keyof HomeStackParamList,
  (focused: boolean) => keyof typeof MaterialCommunityIcons
> = {
  Sources: () => 'bookshelf',
  Explore: (focused) => (focused ? 'compass' : 'compass-outline'),
};

const themedProps = createThemedProps((theme) => ({
  android_ripple: { borderless: true, color: theme.palette.primary.ripple },
}));

function Tab(props: TabProps) {
  const { routeName, isFocused, navigation } = props;

  const contrast = useContrast();
  const theme = useTheme();
  const style = useStyles(styles, contrast);
  const { android_ripple } = useThemedProps(themedProps, contrast);

  const indicator = useSharedValue(isFocused ? 1 : 0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const isMounted = React.useRef<boolean>(false);

  const backgroundColor = useDerivedValue(() =>
    interpolateColor(
      indicator.value,
      [0, 1],
      ['transparent', theme.palette.primary.ripple],
    ),
  );

  const paddingVertical = useDerivedValue(() =>
    interpolate(indicator.value, [0, 1], [0, theme.style.size.s]),
  );
  const paddingHorizontal = useDerivedValue(() =>
    interpolate(indicator.value, [0, 1], [0, theme.style.size.xl]),
  );
  const marginVertical = useDerivedValue(() =>
    interpolate(indicator.value, [0, 1], [theme.style.size.s, 0]),
  );
  const marginHorizontal = useDerivedValue(() =>
    interpolate(indicator.value, [0, 1], [theme.style.size.xl, 0]),
  );

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (isFocused) {
      indicator.value = withTiming(1, { duration: 200, easing: Easing.ease });
      rotation.value = withTiming(
        30,
        { duration: 300, easing: Easing.bounce },
        (finished) => {
          if (finished)
            rotation.value = withTiming(0, {
              duration: 200,
              easing: Easing.bounce,
            });
        },
      );
      scale.value = withTiming(
        1.2,
        { duration: 200, easing: Easing.bounce },
        (finished) => {
          if (finished)
            scale.value = withTiming(1, {
              duration: 200,
              easing: Easing.bounce,
            });
        },
      );
    } else {
      indicator.value = withTiming(0, { duration: 200, easing: Easing.ease });
    }
  }, [isFocused]);

  function handleOnPress() {
    if (!isFocused) navigation.navigate({ name: routeName, params: undefined });
  }
  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: rotation.value + 'deg' }],
    backgroundColor: backgroundColor.value,
    paddingVertical: paddingVertical.value,
    paddingHorizontal: paddingHorizontal.value,
    marginVertical: marginVertical.value,
    marginHorizontal: marginHorizontal.value,
  }));

  const iconStyles = [style.icon, animatedTextStyle];

  const color = isFocused ? 'primary' : 'textSecondary';

  const iconName = icons[routeName](isFocused);

  return (
    <Pressable
      android_ripple={android_ripple}
      style={style.pressable}
      onPress={handleOnPress}
    >
      <View style={style.container}>
        <AnimatedIcon
          type="icon"
          size="small"
          style={iconStyles}
          name={iconName}
          color={color}
        />
        <Text variant="bottom-tab" color={color}>
          {routeName}
        </Text>
      </View>
    </Pressable>
  );
}

export default React.memo(Tab);
