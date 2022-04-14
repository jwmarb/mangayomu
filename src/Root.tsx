import React from 'react';
import RootStack from '@navigators/Root';
import WelcomeScreen from '@screens/Welcome';
import HomeScreen from '@screens/Home';
import { useSelector } from 'react-redux';
import { AppState } from '@redux/store';

const Root: React.FC = () => {
  const showIntroduction = useSelector((state: AppState) => state.settings.showIntroduction);

  return (
    <RootStack.Navigator
      initialRouteName={showIntroduction ? 'Welcome' : 'Home'}
      screenOptions={{ headerShown: false }}>
      <RootStack.Screen component={WelcomeScreen} name='Welcome' options={{ headerShown: false }} />
      <RootStack.Screen component={HomeScreen} name='Home' />
    </RootStack.Navigator>
  );
};

export default Root;
