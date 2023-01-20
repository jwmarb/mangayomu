import { RootStack } from '@navigators/Root';
import Home from '@screens/Home';
import MangaView from '@screens/MangaView';
import React from 'react';

const Root: React.FC = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Home" component={Home} />
      <RootStack.Screen name="MangaView" component={MangaView} />
    </RootStack.Navigator>
  );
};

export default Root;
