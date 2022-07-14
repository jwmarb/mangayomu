import Icon from '@components/Icon';
import { TabProps } from '@components/Screen/Tabs/Tab/Tab.interfaces';
import { TabButtonBase, TabContainer } from '@components/Screen/Tabs/Tabs.base';
import Spacer from '@components/Spacer';
import { Typography } from '@components/Typography';
import React from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useTheme } from 'styled-components/native';

const Tab: React.FC<TabProps> = (props) => {
  const { tabBarIcon, routeName, routeKey, navigation, isFocused } = props;
  const theme = useTheme();
  const TabIcon = tabBarIcon as React.FC<Omit<React.ComponentProps<typeof Icon>, 'bundle' | 'name'>>;
  const color = React.useMemo(() => (isFocused ? 'primary' : 'disabled'), [isFocused]);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  React.useEffect(() => {
    if (isFocused) {
      rotation.value = withTiming(30, { duration: 300, easing: Easing.bounce }, (finished) => {
        if (finished) rotation.value = withSpring(0);
      });
      scale.value = withSpring(1.2, undefined, (finished) => {
        if (finished) scale.value = withSpring(1);
      });
    }
  }, [isFocused]);
  const onPress = React.useCallback(() => {
    const event = navigation.emit({ type: 'tabPress', target: routeKey, canPreventDefault: true });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate({ name: routeName, params: undefined });
    }
  }, [navigation.emit, navigation.navigate, isFocused, routeKey, routeName]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: rotation.value + 'deg' }],
  }));

  return React.useMemo(
    () => (
      <TabButtonBase onPress={onPress}>
        <TabContainer>
          {TabIcon && (
            <>
              <Animated.View style={style}>
                <TabIcon color={color} />
              </Animated.View>
              <Spacer y={1} />
            </>
          )}
          <Typography variant='bottomtab' color={color}>
            {routeName}
          </Typography>
        </TabContainer>
      </TabButtonBase>
    ),
    [isFocused, theme]
  );
};

export default Tab;
