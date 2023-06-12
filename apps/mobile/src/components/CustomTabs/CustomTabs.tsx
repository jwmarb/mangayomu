import Box from '@components/Box';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import {
  Route,
  TabBar,
  TabBarProps,
  TabView,
  TabViewProps,
} from 'react-native-tab-view';

function CustomTabs<T extends Route>(props: TabViewProps<T>) {
  const { renderTabBar = (props) => <CustomTabBar {...props} />, ...rest } =
    props;
  return <TabView renderTabBar={renderTabBar} {...rest} />;
}

function CustomTabBar<T extends Route>(props: TabBarProps<T>) {
  const theme = useTheme();
  const { jumpTo } = props;
  const memoizedJumpTo = React.useCallback((key: string) => {
    jumpTo(key);
  }, []);
  return (
    <TabBar
      {...props}
      style={{ backgroundColor: theme.palette.background.paper }}
      indicatorStyle={{ backgroundColor: theme.palette.primary.main }}
      renderTabBarItem={(tabBarProps) => (
        <TabBarItem
          routeKey={tabBarProps.route.key}
          numOfRoutes={props.navigationState.routes.length}
          focused={
            tabBarProps.route.key ===
            props.navigationState.routes[props.navigationState.index].key
          }
          routeTitle={tabBarProps.route.title}
          jumpTo={memoizedJumpTo}
        />
      )}
    />
  );
}

const TabBarItem = React.memo(function (props: {
  numOfRoutes: number;
  jumpTo: (key: string) => void;
  routeTitle?: string;
  routeKey: string;
  focused: boolean;
}) {
  const { numOfRoutes, routeTitle, focused, jumpTo, routeKey } = props;
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const color = useDerivedValue(() =>
    interpolateColor(
      focused ? 1 : 0,
      [0, 1],
      [theme.palette.text.secondary, theme.palette.primary.main],
    ),
  );
  const style = useAnimatedStyle(() => ({
    color: color.value,
  }));
  return (
    <BorderlessButton
      shouldCancelWhenOutside
      rippleColor={theme.palette.primary.ripple}
      onPress={() => {
        jumpTo(routeKey);
      }}
      style={{ width: width / numOfRoutes }}
    >
      <Box m="m">
        <Text
          as={Animated.Text}
          align="center"
          bold
          style={style}
          variant="button"
        >
          {routeTitle}
        </Text>
      </Box>
    </BorderlessButton>
  );
});

export default CustomTabs;
