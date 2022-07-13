import SettingsStack from '@navigators/Settings';
import Main from '@screens/Settings/screens/Main';
import React from 'react';
import { Header } from '@components/core';
import Appearance from '@screens/Settings/screens/Appearance';
import MangasColumn from '@screens/Settings/screens/MangasColumn';
import Reader from '@screens/Settings/screens/Reader';

const Settings: React.FC = (props) => {
  const {} = props;
  return (
    <SettingsStack.Navigator initialRouteName='Main' screenOptions={{ header: Header }}>
      <SettingsStack.Screen component={Main} name='Main' options={{ headerTitle: 'Settings' }} />
      <SettingsStack.Screen component={Appearance} name='Appearance' options={{ headerTitle: 'Appearance' }} />
      <SettingsStack.Screen component={MangasColumn} name='MangasColumn' options={{ headerTitle: 'Manga Layout' }} />
      <SettingsStack.Screen component={Reader} name='Reader' options={{ headerTitle: 'Reader' }} />
    </SettingsStack.Navigator>
  );
};

export default Settings;
