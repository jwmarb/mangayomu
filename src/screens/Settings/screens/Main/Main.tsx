import React from 'react';
import { List, Icon, ListItem } from '@components/core';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsStackParamList } from '@navigators/Settings/Settings.interfaces';

const Main: React.FC<StackScreenProps<SettingsStackParamList, 'Main'>> = (props) => {
  const { navigation } = props;
  function navigateTo(screenName: keyof SettingsStackParamList) {
    return () => {
      navigation.navigate(screenName);
    };
  }
  return (
    <List>
      <ListItem adornment={<Icon bundle='MaterialCommunityIcons' name='cog' color='textSecondary' />} title='General' />
      <ListItem
        onPress={navigateTo('Appearance')}
        adornment={<Icon bundle='MaterialCommunityIcons' name='palette' color='textSecondary' />}
        title='Appearance'
      />
      <ListItem
        adornment={<Icon bundle='MaterialCommunityIcons' name='bell' color='textSecondary' />}
        title='Notifications'
      />
      <ListItem adornment={<Icon bundle='Feather' name='book-open' color='textSecondary' />} title='Reader' />
      <ListItem adornment={<Icon bundle='Feather' name='compass' color='textSecondary' />} title='Browse' />
      <ListItem adornment={<Icon bundle='Feather' name='code' color='textSecondary' />} title='Advanced' />
    </List>
  );
};

export default Main;
