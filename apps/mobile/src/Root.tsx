import { RootStack } from '@navigators/Root';
import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import Home from '@screens/Home';
import MangaView from '@screens/MangaView';
import React from 'react';
import Welcome from '@screens/Welcome/Welcome';

const mapStateToProps = (state: AppState) => ({
  showWelcomeScreen: state.__initial__,
});

const Root: React.FC<RootProps> = ({ showWelcomeScreen }) => {
  return (
    <RootStack.Navigator
      initialRouteName={showWelcomeScreen ? 'Welcome' : 'Home'}
    >
      <RootStack.Screen name="Home" component={Home} />
      <RootStack.Screen name="MangaView" component={MangaView} />
      <RootStack.Screen name="Welcome" component={Welcome} />
    </RootStack.Navigator>
  );
};

const connector = connect(mapStateToProps);

type RootProps = ConnectedProps<typeof connector>;

export default connector(Root);
