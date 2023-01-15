import { Icon, List, ListItem, ListSection, Typography } from '@components/core';
import { SettingsStackParamList } from '@navigators/Settings/Settings.interfaces';
import { useSettingsNavigation } from '@navigators/Settings/Settings';
import React from 'react';
import ItemDropdown from '@screens/Settings/screens/components/ItemDropdown';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';
import connector, { ConnectedAppearanceProps } from '@screens/Settings/screens/Appearance/Appearance.redux';
import { ChangeableTheme } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import { Menu, MenuTrigger, MenuOption, MenuOptions } from 'react-native-popup-menu';
import { FontFamily } from '@theme/core';
import { useTheme } from 'styled-components/native';
import { ItemDropdownMenu } from '@screens/Settings/screens/components/ItemDropdown/ItemDropdown.interfaces';

const Appearance: React.FC<ConnectedAppearanceProps> = (props) => {
  const { changeAppTheme, theme, changeFont, fontFamily } = props;
  const navigation = useSettingsNavigation();

  const navigateTo = (screenName: keyof SettingsStackParamList) => {
    return () => {
      navigation.navigate(screenName);
    };
  };
  const onChangeFont = (fontFamily: FontFamily) => {
    return () => changeFont(fontFamily);
  };

  const themeOptions: ItemDropdownMenu[] = React.useMemo(
    (): ItemDropdownMenu[] =>
      Object.values(ChangeableTheme).map(
        (x): ItemDropdownMenu => ({
          isSelected: theme === x,
          text: x,
          onPress: () => {
            changeAppTheme(x);
          },
        })
      ),
    [theme]
  );

  const fontOptions: ItemDropdownMenu[] = React.useMemo(
    () =>
      Object.values(FontFamily).map(
        (x): ItemDropdownMenu => ({
          text: x,
          isSelected: x === fontFamily,
          onPress: onChangeFont(x),
          fontFamily: x,
        })
      ),
    [fontFamily]
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
      <ItemDropdown
        title='Font family'
        subtitle={fontFamily}
        icon={<Icon bundle='MaterialCommunityIcons' name='format-letter-case' color='primary' />}
        items={fontOptions}
      />
    </>
  );
};

export default connector(Appearance);
