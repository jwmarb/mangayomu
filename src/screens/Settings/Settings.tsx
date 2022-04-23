import SettingsStackNavigator from '@navigators/Settings';
import Main from '@screens/Settings/screens/Main';
import React from 'react';
import { Header } from '@components/core';

const Settings: React.FC = (props) => {
  const {} = props;
  return (
    <SettingsStackNavigator.Navigator initialRouteName='Main' screenOptions={{ header: Header }}>
      <SettingsStackNavigator.Screen component={Main} name='Main' options={{ headerTitle: 'Settings' }} />
    </SettingsStackNavigator.Navigator>
  );
};

export default Settings;
