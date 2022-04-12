import React from 'react';
import RootStack from '@navigators/Root';
import WelcomeScreen from '@screens/Welcome';
import HomeScreen from '@screens/Home';

const Root: React.FC = () => {
  return (
    <RootStack.Navigator initialRouteName='Welcome' screenOptions={{ headerShown: false }}>
      <RootStack.Screen component={WelcomeScreen} name='Welcome' options={{ headerShown: false }} />
      <RootStack.Screen component={HomeScreen} name='Home' />
    </RootStack.Navigator>
  );
};

export default Root;
