import { RootStack } from '@navigators/Root';
import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import Home from '@screens/Home';
import MangaView from '@screens/MangaView';
import React from 'react';
import Welcome from '@screens/Welcome/Welcome';
import BasicMangaList from '@screens/BasicMangaList';
import SourceView from '@screens/SourceView';
import InfiniteMangaList from '@screens/InfiniteMangaList';
import Settings from '@screens/Settings';
import Appearance from '@screens/Appearance';
import Reader from '@screens/Reader';
import MainSourceSelector from '@screens/MainSourceSelector/MainSourceSelector';
import UnfinishedMangaList from '@screens/UnfinishedMangaList';
import GlobalReaderSettings from '@screens/GlobalReaderSettings';
import Login from '@screens/Login';
import Register from '@screens/Register';
import SplashScreen from 'react-native-splash-screen';
import { InteractionManager } from 'react-native';

const mapStateToProps = (state: AppState) => ({
  showWelcomeScreen: state.__initial__.firstTimeUser,
});

const Root: React.FC<RootProps> = ({ showWelcomeScreen }) => {
  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      SplashScreen.hide();
    });
  }, []);
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
      <RootStack.Screen
        name="MainSourceSelector"
        component={MainSourceSelector}
      />
      <RootStack.Screen
        name="UnfinishedMangaList"
        component={UnfinishedMangaList}
      />
      <RootStack.Screen
        name="GlobalReaderSettings"
        component={GlobalReaderSettings}
      />
      <RootStack.Screen name="Login" component={Login} />
      <RootStack.Screen name="Register" component={Register} />
    </RootStack.Navigator>
  );
};

const connector = connect(mapStateToProps);

type RootProps = ConnectedProps<typeof connector>;

export default connector(Root);
