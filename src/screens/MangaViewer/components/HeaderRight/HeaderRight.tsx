import { Icon, IconButton, MenuOption, MenuTitle } from '@components/core';
import React from 'react';
import { Share, Linking } from 'react-native';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { useTheme } from 'styled-components/native';
import { HeaderRightProps } from './HeaderRight.interfaces';
import connector, { ConnectedHeaderRightProps } from './HeaderRight.redux';

const HeaderRight: React.FC<ConnectedHeaderRightProps> = (props) => {
  const { manga, downloadSelected, chapters } = props;
  const [opened, setOpened] = React.useState<boolean>(false);
  const handleOnDownloadAll = () => {
    const allChapters = Object.keys(chapters).reduce(
      (prev, curr) => ({
        ...prev,
        [curr]: null,
      }),
      {} as Record<string, null>
    );
    downloadSelected(allChapters, manga);
  };
  const handleOnOpen = () => {
    setOpened(true);
  };

  const handleOnClose = () => {
    setOpened(false);
  };
  const theme = useTheme();
  const handleOnSelect = (option: number) => {
    switch (option) {
      case 0:
        handleOnDownloadAll();
        break;
    }
    handleOnClose();
  };
  return (
    <>
      <IconButton
        icon={<Icon bundle='Feather' name='share-2' />}
        onPress={async () => {
          try {
            await Share.share({
              title: 'Share URL',
              message: manga.link,
              url: manga.link,
            });
          } catch (e) {
            alert(e);
          }
        }}
      />
      <IconButton
        icon={<Icon bundle='Feather' name='globe' />}
        onPress={() => {
          Linking.openURL(manga.link);
        }}
      />
      <Menu onBackdropPress={handleOnClose} onClose={handleOnClose} opened={opened} onSelect={handleOnSelect}>
        <MenuTrigger>
          <IconButton onPress={handleOnOpen} icon={<Icon bundle='Feather' name='more-vertical' />} />
        </MenuTrigger>
        <MenuOptions customStyles={theme.menuOptionsStyle}>
          <MenuTitle>Quick Actions</MenuTitle>
          <MenuOption text='Download all chapters' icon={<Icon bundle='Feather' name='download' />} value={0} />
        </MenuOptions>
      </Menu>
    </>
  );
};

export default connector(HeaderRight);
