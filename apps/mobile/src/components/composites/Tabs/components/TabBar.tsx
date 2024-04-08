import React from 'react';
import { Route, TabBarProps } from 'react-native-tab-view';
import { TabBar as DefaultTabBar } from 'react-native-tab-view';
import TabBarItem from '@/components/composites/Tabs/components/TabBarItem';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';

const styles = createStyles((theme) => ({
  tabBar: {
    backgroundColor: theme.palette.background.menu,
  },
  indicator: {
    backgroundColor: theme.palette.primary.main,
  },
}));

export default function TabBar<T extends Route>(props: TabBarProps<T>) {
  const { jumpTo } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const renderTabBarItem: React.ComponentProps<
    typeof DefaultTabBar<T>
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
  const memoizedJumpTo = React.useCallback((key: string) => {
    jumpTo(key);
  }, []);

  return (
    <DefaultTabBar
      {...props}
      style={style.tabBar}
      indicatorStyle={style.indicator}
      renderTabBarItem={renderTabBarItem}
    />
  );
}
