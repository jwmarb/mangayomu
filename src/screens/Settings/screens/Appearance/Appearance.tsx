import { Icon, List, ListItem, ListSection } from '@components/core';
import { SettingsStackParamList } from '@navigators/Settings/Settings.interfaces';
import { useSettingsNavigation } from '@navigators/Settings/Settings';
import React from 'react';
import ItemDropdown from '@screens/Settings/screens/components/ItemDropdown';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';
import connector, { ConnectedAppearanceProps } from '@screens/Settings/screens/Appearance/Appearance.redux';
import { ChangeableTheme } from '@redux/reducers/settingsReducer/settingsReducer.constants';

const Appearance: React.FC<ConnectedAppearanceProps> = (props) => {
  const { changeAppTheme, theme } = props;
  const navigation = useSettingsNavigation();
  const navigateTo = (screenName: keyof SettingsStackParamList) => {
    return () => {
      navigation.navigate(screenName);
    };
  };
  const themeOptions: MenuItemProps[] = React.useMemo(
    (): MenuItemProps[] =>
      Object.values(ChangeableTheme).map(
        (x): MenuItemProps => ({
          text: x,
          onPress: () => {
            changeAppTheme(x);
          },
        })
      ),
    []
  );

  return (
    <>
      <ListSection title='Appearance' />
      <ListItem
        adornment={<Icon bundle='MaterialCommunityIcons' name='book-outline' color='primary' />}
        subtitle='Change the way mangas appear on your screen'
        title='Manga layout'
        onPress={navigateTo('MangasColumn')}
      />
      <ItemDropdown
        title='Theme'
        items={themeOptions}
        subtitle={theme}
        icon={<Icon bundle='MaterialCommunityIcons' name='palette-outline' color='primary' />}
      />
    </>
  );
};

export default connector(Appearance);
