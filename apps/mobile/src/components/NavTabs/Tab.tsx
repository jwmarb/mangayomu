import Box from '@components/Box';
import Icon from '@components/Icon';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import displayMessage from '@helpers/displayMessage';
import React from 'react';
import { StyleSheet } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { moderateScale } from 'react-native-size-matters';
import { TabProps } from './Tab.interfaces';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const tabIcons = {
  Explore: (
    <Icon variant="inherit" size={moderateScale(20)} name="compass-outline" />
  ),
  Library: <Icon variant="inherit" size={moderateScale(20)} name="bookshelf" />,
  History: <Icon variant="inherit" size={moderateScale(20)} name="history" />,
  Settings: <Icon variant="inherit" size={moderateScale(20)} name="cog" />,
};

const Tab: React.FC<TabProps> = (props) => {
  const { tabBarIcon, routeKey, routeName, isFocused, navigation } = props;
  const theme = useTheme();
  const indicator = useSharedValue(isFocused ? 1 : 0);
  React.useEffect(() => {
    if (isFocused) {
      indicator.value = withTiming(1, { duration: 500, easing: Easing.ease });
      rotation.value = withTiming(
        30,
        { duration: 300, easing: Easing.bounce },
        (finished) => {
          if (finished) rotation.value = withSpring(0);
        },
      );
      scale.value = withSpring(1.2, undefined, (finished) => {
        if (finished) scale.value = withSpring(1);
      });
    } else {
      indicator.value = withTiming(0, { duration: 300, easing: Easing.ease });
    }
  }, [isFocused]);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const color = useDerivedValue(() =>
    interpolateColor(
      indicator.value,
      [0, 1],
      [theme.palette.text.secondary, theme.palette.primary.main],
    ),
  );

  function handleOnPress() {
    if (!isFocused) navigation.navigate({ name: routeName, params: undefined });
  }

  const textStyle = useAnimatedStyle(() => ({
    color: color.value,
  }));

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: rotation.value + 'deg' }],
  }));

  const memoTextStyle = React.useMemo(
    () => [textStyle, style],
    [textStyle, style],
  );

  function handleOnLongPress() {
    ReactNativeHapticFeedback.trigger('impactHeavy', {
      enableVibrateFallback: true,
    });
    displayMessage(routeName);
  }

  return (
    <BorderlessButton
      style={styles.button}
      onPress={handleOnPress}
      onLongPress={handleOnLongPress}
    >
      <Box py="m" px="s" flex-direction="column" align-items="center" flex-grow>
        <Text
          as={Animated.Text}
          variant="header"
          color={isFocused ? 'primary' : 'textSecondary'}
          style={memoTextStyle}
        >
          {tabIcons[routeName]}
        </Text>
        <Text
          as={Animated.Text}
          variant="bottom-tab"
          color={isFocused ? 'primary' : 'textSecondary'}
          style={textStyle}
        >
          {routeName}
        </Text>
      </Box>
    </BorderlessButton>
  );
};

const styles = StyleSheet.create({
  button: {
    flexGrow: 1,
  },
});

export default Tab;
