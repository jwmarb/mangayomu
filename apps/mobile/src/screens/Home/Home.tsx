import { TabHeader } from '@components/NavHeader';
import { HomeTabNavigator } from '@navigators/Home';
import Explore from '@screens/Explore';
import History from '@screens/History';
import Library from '@screens/Library';
import Settings from '@screens/Settings';
import React from 'react';

const Home: React.FC = () => {
  return (
    <HomeTabNavigator.Navigator
      initialRouteName="Explore"
      screenOptions={{ header: TabHeader }}
    >
      <HomeTabNavigator.Screen component={Explore} name="Explore" />
      <HomeTabNavigator.Screen component={Library} name="Library" />
      <HomeTabNavigator.Screen component={History} name="History" />
      <HomeTabNavigator.Screen component={Settings} name="Settings" />
    </HomeTabNavigator.Navigator>
  );
};

export default Home;
