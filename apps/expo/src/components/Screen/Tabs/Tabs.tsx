import ButtonBase from '@components/Button/ButtonBase';
import Icon from '@components/Icon';
import Tab from '@components/Screen/Tabs/Tab/Tab';
import { TabButtonBase, TabContainer, TabsContainer } from '@components/Screen/Tabs/Tabs.base';
import Spacer from '@components/Spacer';
import { Typography } from '@components/Typography';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import React from 'react';
import { AppState } from '@redux/store';
import { useSelector } from 'react-redux';

const Tabs: React.FC<BottomTabBarProps> = (props) => {
  const { navigation: _navigation, descriptors, state } = props;
  const deviceOrientation = useSelector((state: AppState) => state.settings.deviceOrientation);
  const navigation = React.useMemo(() => _navigation, []);
  return (
    <TabsContainer deviceOrientation={deviceOrientation}>
      {state.routes.map((route, index) => (
        <Tab
          key={route.key}
          routeKey={route.key}
          routeName={route.name}
          isFocused={state.index === index}
          tabBarIcon={descriptors[route.key].options.tabBarIcon}
          navigation={navigation}
        />
      ))}
    </TabsContainer>
  );
};

export default (props: BottomTabBarProps) => <Tabs {...props} />;
