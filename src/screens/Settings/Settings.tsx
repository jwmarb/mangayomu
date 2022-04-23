import SettingsStackNavigator from '@navigators/Settings';
import Main from '@screens/Settings/screens/Main';
import React from 'react';

const Settings: React.FC = (props) => {
  const {} = props;
  return (
    <SettingsStackNavigator.Navigator initialRouteName='Main'>
      <SettingsStackNavigator.Screen component={Main} name='Main' />
    </SettingsStackNavigator.Navigator>
  );
};

export default Settings;
