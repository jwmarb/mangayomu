import { RootStack } from '@navigators/Root';
import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import Home from '@screens/Home';
import MangaView from '@screens/MangaView';
import React from 'react';
import Welcome from '@screens/Welcome/Welcome';
import { StackHeader } from '@components/NavHeader';
import BasicMangaList from '@screens/BasicMangaList';
import SourceView from '@screens/SourceView';
import InfiniteMangaList from '@screens/InfiniteMangaList';
import Settings from '@screens/Settings';
import Appearance from '@screens/Appearance';
import Reader from '@screens/Reader';

const mapStateToProps = (state: AppState) => ({
  showWelcomeScreen: state.__initial__.firstTimeUser,
});

const Root: React.FC<RootProps> = ({ showWelcomeScreen }) => {
  return (
    <RootStack.Navigator
      initialRouteName={showWelcomeScreen ? 'Welcome' : 'Home'}
    >
      <RootStack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <RootStack.Screen name="MangaView" component={MangaView} />
      <RootStack.Screen
        name="Welcome"
        component={Welcome}
        options={{ headerShown: false }}
      />
      <RootStack.Screen name="BasicMangaList" component={BasicMangaList} />
      <RootStack.Screen name="SourceView" component={SourceView} />
      <RootStack.Screen
        name="InfiniteMangaList"
        component={InfiniteMangaList}
      />
      <RootStack.Screen name="Settings" component={Settings} />
      <RootStack.Screen name="Appearance" component={Appearance} />
      <RootStack.Screen
        name="Reader"
        component={Reader}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );
};

const connector = connect(mapStateToProps);

type RootProps = ConnectedProps<typeof connector>;

export default connector(Root);
