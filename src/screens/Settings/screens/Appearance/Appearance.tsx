import { Icon, List, ListItem, ListSection } from '@components/core';
import { SettingsStackParamList } from '@navigators/Settings/Settings.interfaces';
import { useSettingsNavigation } from '@navigators/Settings/Settings';
import React from 'react';

const Appearance: React.FC = () => {
  const navigation = useSettingsNavigation();
  const navigateTo = (screenName: keyof SettingsStackParamList) => {
    return () => {
      navigation.navigate(screenName);
    };
  };

  return (
    <>
      <ListSection title='Appearance' />
      <ListItem
        adornment={<Icon bundle='MaterialCommunityIcons' name='book-outline' color='primary' />}
        subtitle='Change the way mangas appear on your screen'
        title='Manga layout'
        onPress={navigateTo('MangasColumn')}
      />
    </>
  );
};

export default React.memo(Appearance);
