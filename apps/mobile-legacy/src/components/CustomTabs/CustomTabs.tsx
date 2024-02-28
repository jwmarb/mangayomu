import React from 'react';
import { Route, TabView, TabViewProps } from 'react-native-tab-view';
import CustomTabBar from './CustomTabBar';

function defaultRenderTabBar<T extends Route>(
  props: Parameters<NonNullable<TabViewProps<T>['renderTabBar']>>[0],
) {
  return <CustomTabBar {...props} />;
}

function CustomTabs<T extends Route>(props: TabViewProps<T>) {
  const { renderTabBar = defaultRenderTabBar, ...rest } = props;
  return <TabView renderTabBar={renderTabBar} {...rest} />;
}

export default CustomTabs;
