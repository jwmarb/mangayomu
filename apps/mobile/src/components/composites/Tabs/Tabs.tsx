import { Route, TabView, TabViewProps } from 'react-native-tab-view';
import TabBar from '@/components/composites/Tabs/components/TabBar';

function defaultRenderTabBar<T extends Route>(
  props: Parameters<NonNullable<TabViewProps<T>['renderTabBar']>>[0],
) {
  return <TabBar {...props} />;
}

export default function Tabs<T extends Route>(props: TabViewProps<T>) {
  const { renderTabBar = defaultRenderTabBar, ...rest } = props;
  return <TabView renderTabBar={renderTabBar} {...rest} />;
}
