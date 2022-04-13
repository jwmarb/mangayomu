import React from 'react';
import RootStack from '@navigators/Root';
import WelcomeScreen from '@screens/Welcome';
import HomeScreen from '@screens/Home';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@redux/store';

const Root: React.FC = () => {
  const dispatch = useDispatch();
  const showIntroduction = useSelector((state: AppState) => state.settings.showIntroduction);
  React.useLayoutEffect(() => {}, []);
  return (
    <RootStack.Navigator initialRouteName='Welcome' screenOptions={{ headerShown: false }}>
      <RootStack.Screen component={WelcomeScreen} name='Welcome' options={{ headerShown: false }} />
      <RootStack.Screen component={HomeScreen} name='Home' />
    </RootStack.Navigator>
  );
};

export default Root;
