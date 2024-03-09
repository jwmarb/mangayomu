import React from 'react';
import { RootStack } from '@/screens/navigator';
import Home from '@/screens/Home';

function App(): React.JSX.Element {
  return (
    <RootStack.Navigator initialRouteName="Home">
      <RootStack.Screen name="Home" component={Home} />
    </RootStack.Navigator>
  );
}

export default App;
