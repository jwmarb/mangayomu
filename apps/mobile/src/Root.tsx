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
import { useUser } from '@realm/react';
import useAuth0 from '@hooks/useAuth0';
import useDialog from '@hooks/useDialog';
import UnfinishedMangaList from '@screens/UnfinishedMangaList/UnfinishedMangaList';

const mapStateToProps = (state: AppState) => ({
  showWelcomeScreen: state.__initial__.firstTimeUser,
});

const Root: React.FC<RootProps> = ({ showWelcomeScreen }) => {
  const realmUser = useUser();
  const { user, authorize, clearSession } = useAuth0();
  const dialog = useDialog();
  React.useEffect(() => {
    if (
      (user == null &&
        realmUser != null &&
        realmUser.isLoggedIn &&
        realmUser.providerType !== 'anon-user') ||
      (realmUser != null &&
        !realmUser.isLoggedIn &&
        realmUser.providerType !== 'anon-user')
    )
      (async () => {
        try {
          await authorize({ scope: 'openid profile email' });
        } catch (e) {
          await clearSession();
          try {
            await authorize({ scope: 'openid profile email' });
          } catch (e) {
            dialog.open({
              title: 'Failed to login',
              message:
                'Two login attempts failed. This could be an issue with your client or the authentication server.',
            });
          }
        }
      })();
    if (user != null && realmUser != null && !realmUser.isLoggedIn)
      clearSession();
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
    </RootStack.Navigator>
  );
};

const connector = connect(mapStateToProps);

type RootProps = ConnectedProps<typeof connector>;

export default connector(Root);
