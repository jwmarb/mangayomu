import AppearanceStack from '@navigators/Appearance/Appearance';
import Main from '@screens/Settings/screens/Appearance/screens/Main';
import MangasColumn from '@screens/Settings/screens/Appearance/screens/MangasColumn';
import React from 'react';

const Appearance: React.FC = (props) => {
  const {} = props;
  return (
    <AppearanceStack.Navigator initialRouteName='Main'>
      <AppearanceStack.Screen name='Main' component={Main} />
      <AppearanceStack.Screen name='MangasColumn' component={MangasColumn} />
    </AppearanceStack.Navigator>
  );
};

export default Appearance;
