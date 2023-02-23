import { TabHeader } from '@components/NavHeader';
import NavTabs from '@components/NavTabs';
import { HomeTabNavigator } from '@navigators/Home';
import Explore from '@screens/Explore';
import History from '@screens/History';
import Library from '@screens/Library';
import More from '@screens/More';
import React from 'react';

const Home: React.FC = () => {
  return (
    <HomeTabNavigator.Navigator
      initialRouteName="Explore"
      screenOptions={{
        header: TabHeader,
      }}
      tabBar={NavTabs}
    >
      <HomeTabNavigator.Screen component={Explore} name="Explore" />
      <HomeTabNavigator.Screen component={Library} name="Library" />
      <HomeTabNavigator.Screen component={History} name="History" />
      <HomeTabNavigator.Screen component={More} name="More" />
    </HomeTabNavigator.Navigator>
  );
};

export default Home;
