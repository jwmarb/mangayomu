import Box from '@components/Box';
import Icon from '@components/Icon';
import Text from '@components/Text';
import displayMessage from '@helpers/displayMessage';
import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { moderateScale } from 'react-native-size-matters';
import { TabProps } from './';
import vibrate from '@helpers/vibrate';
import Pressable from '@components/Pressable';

const tabIcons = {
  Explore: (
    <Icon
      type="font"
      variant="inherit"
      size={moderateScale(20)}
      name="compass-outline"
    />
  ),
  Library: (
    <Icon
      type="font"
      variant="inherit"
      size={moderateScale(20)}
      name="bookshelf"
    />
  ),
  History: (
    <Icon
      type="font"
      variant="inherit"
      size={moderateScale(20)}
      name="history"
    />
  ),
  More: (
    <Icon
      type="font"
      variant="inherit"
      size={moderateScale(20)}
      name="dots-horizontal"
    />
  ),
  Browse: (
    <Icon
      type="font"
      variant="inherit"
      size={moderateScale(20)}
      name="magnify"
    />
  ),
};

const Tab: React.FC<TabProps> = (props) => {
  const { routeName, isFocused, navigation } = props;
  const indicator = useSharedValue(isFocused ? 1 : 0);
  React.useEffect(() => {
    if (isFocused) {
      indicator.value = withTiming(1, { duration: 500, easing: Easing.ease });
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
      indicator.value = withTiming(0, { duration: 300, easing: Easing.ease });
    }
  }, [isFocused]);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  function handleOnPress() {
    if (!isFocused) navigation.navigate({ name: routeName, params: undefined });
  }

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: rotation.value + 'deg' }],
  }));

  function handleOnLongPress() {
    displayMessage(routeName);
    vibrate();
  }

  return (
    <Pressable
      style={styles.button}
      onPress={handleOnPress}
      onLongPress={handleOnLongPress}
      borderless
    >
      <Box py="m" px="s" flex-direction="column" align-items="center" flex-grow>
        <Text
          as={Animated.Text}
          variant="header"
          color={isFocused ? 'primary' : 'textSecondary'}
          style={style}
        >
          {tabIcons[routeName]}
        </Text>
        <Text
          as={Animated.Text}
          variant="bottom-tab"
          color={isFocused ? 'primary' : 'textSecondary'}
        >
          {routeName}
        </Text>
      </Box>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexGrow: 1,
  },
});

export default React.memo(Tab);
