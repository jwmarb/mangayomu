import { Button, Icon, List, ListItem, ListSection } from '@components/core';
import { ReaderBackgroundColor, ReaderDirection } from '@redux/reducers/settingsReducer/settingsReducer';
import connector, { ConnectedReaderSettingsScreenProps } from '@screens/Settings/screens/Reader/Reader.redux';
import React from 'react';
import { Switch } from 'react-native-gesture-handler';
import { HoldItem } from 'react-native-hold-menu';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';

const Reader: React.FC<ConnectedReaderSettingsScreenProps> = (props) => {
  const { settings, changeReaderBackground, changeReaderDirection } = props;
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
      <ListItem title='Background color' subtitle={settings.backgroundColor} holdItem={bgColorOptions} />
      <ListItem
        holdItem={readerDirectionOptions}
        title='Reading direction'
        subtitle={settings.preferredReadingDirection}
      />
      <ListItem title='Keep screen awake' />
      <ListItem title='Show page number' />
      <ListItem title='Skip chapters marked read' />
    </>
  );
};

export default connector(React.memo(Reader));
