import React from 'react';
import { RootStack } from '@/screens/navigator';
import Home from '@/screens/Home';

const HOME_SCREEN_OPTIONS = { headerShown: false };

function App(): React.JSX.Element {
  return (
    <RootStack.Navigator initialRouteName="Home">
      <RootStack.Screen
        name="Home"
        component={Home}
        options={HOME_SCREEN_OPTIONS}
      />
    </RootStack.Navigator>
  );
}

export default App;
