import { StackHeader, IconButton, Icon } from '@components/core';
import HomeStack from '@navigators/Home';
import React from 'react';
import { HomeProps } from './Home.interfaces';
import Main from './screens/Main';

const HomeScreen: React.FC<HomeProps> = (props) => {
  return (
    <HomeStack.Navigator
      initialRouteName='Main'
      screenOptions={{
        header: StackHeader,

        headerRight: () => <IconButton icon={<Icon bundle='AntDesign' name='search1' />} />,
      }}>
      <HomeStack.Screen component={Main} name='Main' options={{ headerTitle: 'Explore' }} />
    </HomeStack.Navigator>
  );
};

export default HomeScreen;
