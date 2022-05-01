import { Icon, List, ListItem } from '@components/core';
import { SettingsStackParamList } from '@navigators/Settings/Settings.interfaces';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';

const Appearance: React.FC<StackScreenProps<SettingsStackParamList, 'Appearance'>> = (props) => {
  const { navigation } = props;
  const navigateTo = (screenName: keyof SettingsStackParamList) => {
    return () => {
      navigation.navigate(screenName);
    };
  };

  return (
    <List>
      <ListItem
        adornment={<Icon bundle='MaterialCommunityIcons' name='book' color='textSecondary' />}
        subtitle='Change the way mangas appear on your screen'
        title='Manga Layout'
        onPress={navigateTo('MangasColumn')}
      />
    </List>
  );
};

export default Appearance;
