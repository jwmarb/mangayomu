import HomeStack from '@navigators/Home';
import React from 'react';
import { HomeProps } from './Home.interfaces';
import Main from './screens/Main';

const HomeScreen: React.FC<HomeProps> = (props) => {
  return (
    <HomeStack.Navigator initialRouteName='Main'>
      <HomeStack.Screen component={Main} name='Main' />
    </HomeStack.Navigator>
  );
};

export default HomeScreen;
