import { useTheme } from '@emotion/react';
import React from 'react';
import { Route, TabBar, TabBarProps } from 'react-native-tab-view';
import TabBarItem from '../TabBarItem';

export default function CustomTabBar<T extends Route>(props: TabBarProps<T>) {
  const theme = useTheme();
  const { jumpTo } = props;
  const memoizedJumpTo = React.useCallback((key: string) => {
    jumpTo(key);
  }, []);
  const style = {
    backgroundColor: theme.palette.background.paper,
  };
  const indicatorStyle = { backgroundColor: theme.palette.primary.main };
  const renderTabBarItem: React.ComponentProps<
    typeof TabBar<T>
  >['renderTabBarItem'] = (tabBarProps) => (
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
  );
  return (
    <TabBar
      {...props}
      style={style}
      indicatorStyle={indicatorStyle}
      renderTabBarItem={renderTabBarItem}
    />
  );
}
