import React from 'react';
import { View } from 'react-native';
import RootStack from '@navigators/Root';
import WelcomeScreen from '@screens/Welcome';

const Root: React.FC = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen component={WelcomeScreen} name='Welcome' options={{ headerShown: false }} />
    </RootStack.Navigator>
  );
};

export default Root;
