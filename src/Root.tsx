import React from 'react';
import RootStack from '@navigators/Root';
import WelcomeScreen from '@screens/Welcome';
import HomeScreen from '@screens/Home';
import { useSelector } from 'react-redux';
import { AppState } from '@redux/store';
import MangaViewer from '@screens/Home/screens/MangaViewer/MangaViewer';
import { BottomTabHeader, Header } from '@components/core';

const Root: React.FC = () => {
  const showIntroduction = useSelector((state: AppState) => state.settings.showIntroduction);

  return (
    <RootStack.Navigator initialRouteName={showIntroduction ? 'Welcome' : 'Home'}>
      <RootStack.Screen component={WelcomeScreen} name='Welcome' options={{ headerShown: false }} />
      <RootStack.Screen component={HomeScreen} name='Home' options={{ headerShown: false }} />
      <RootStack.Screen component={MangaViewer} name='MangaViewer' options={{ header: Header, headerTitle: '' }} />
    </RootStack.Navigator>
  );
};

export default Root;
