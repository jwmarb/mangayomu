import { Button, Checkbox, Icon, List, ListItem, ListSection, Switch } from '@components/core';
import { ReaderBackgroundColor, ReaderDirection } from '@redux/reducers/settingsReducer/settingsReducer';
import ItemDropdown from '@screens/Settings/screens/components/ItemDropdown';
import ItemToggle from '@screens/Settings/screens/components/ItemToggle';

import connector, { ConnectedReaderSettingsScreenProps } from '@screens/Settings/screens/Reader/Reader.redux';
import React from 'react';
import { HoldItem } from 'react-native-hold-menu';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';

const Reader: React.FC<ConnectedReaderSettingsScreenProps> = (props) => {
  const {
    settings,
    changeReaderBackground,
    changeReaderDirection,
    toggleSkipChaptersMarkedRead,
    toggleKeepDeviceAwake,
    toggleShowPageNumber,
  } = props;
  const bgColorOptions: MenuItemProps[] = React.useMemo(
    () =>
      Object.values(ReaderBackgroundColor).map(
        (x): MenuItemProps => ({
          text: x,
          onPress: () => {
            changeReaderBackground(x);
          },
        })
      ),
    []
  );
  const readerDirectionOptions: MenuItemProps[] = React.useMemo(
    () =>
      Object.values(ReaderDirection).map(
        (x): MenuItemProps => ({
          text: x,
          onPress: () => {
            changeReaderDirection(x);
          },
        })
      ),
    []
  );

  return (
    <>
      <ListSection title='Reader' />
      <ItemDropdown title='Background color' subtitle={settings.backgroundColor} items={bgColorOptions} />
      <ItemDropdown
        title='Reading direction'
        subtitle={settings.preferredReadingDirection}
        items={readerDirectionOptions}
      />
      <ItemToggle title='Keep device awake' enabled={settings.keepDeviceAwake} onChange={toggleKeepDeviceAwake} />
      <ItemToggle title='Show page number' enabled={settings.showPageNumber} onChange={toggleShowPageNumber} />
      <ItemToggle
        title='Skip chapters marked read'
        enabled={settings.skipChaptersMarkedRead}
        onChange={toggleSkipChaptersMarkedRead}
      />
    </>
  );
};

export default connector(Reader);
