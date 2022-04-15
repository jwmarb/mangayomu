import { StackHeader, IconButton, Icon, StackTabs } from '@components/core';
import BottomTab from '@navigators/BottomTab';
import React from 'react';
import { HomeProps } from './Home.interfaces';
import Main from './screens/Main';

const HomeScreen: React.FC<HomeProps> = (props) => {
  return (
    <BottomTab.Navigator
      initialRouteName='Explore'
      screenOptions={{
        header: StackHeader,

        headerRight: () => <IconButton icon={<Icon bundle='AntDesign' name='search1' />} />,
      }}
      tabBar={StackTabs}>
      <BottomTab.Screen component={Main} name='Explore' options={{ headerTitle: 'Explore' }} />
    </BottomTab.Navigator>
  );
};

export default HomeScreen;
