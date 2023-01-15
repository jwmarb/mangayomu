import { MangaCoverProps } from './MangaCover.interfaces';
import { MangaCover as Cover } from '@components/core';
import React from 'react';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';
import displayMessage from '@utils/displayMessage';
import { HoldItem } from 'react-native-hold-menu';
import { convertToURI } from '@screens/MangaViewer/components/MangaCover/MangaCover.helpers';
import * as Clipboard from 'expo-clipboard';

const MangaCover: React.FC<MangaCoverProps> = (props) => {
  const { mangaCoverURI, title } = props;

  const menuItems: MenuItemProps[] = [
    { text: 'Actions', isTitle: true },
    {
      text: 'Save Image',
      onPress: async () => {
        try {
          const fileName = await convertToURI(title, mangaCoverURI);
          const { uri } = await FileSystem.downloadAsync(mangaCoverURI, `${FileSystem.documentDirectory}${fileName}`);
          const response = await MediaLibrary.requestPermissionsAsync(true);
          if (response.granted) {
            await MediaLibrary.saveToLibraryAsync(uri);
            displayMessage('Image saved.');
          } else displayMessage('Failed to save image due to insufficient permissions.');
        } catch (e) {
          displayMessage(e as any);
        }
      },
      icon: 'save',
    },
    {
      text: 'Copy Image URL',
      icon: 'link',
      onPress: async () => {
        try {
          await Clipboard.setStringAsync(mangaCoverURI);
          displayMessage('Copied to clipboard.');
        } catch (e) {
          displayMessage(e as any);
        }
      },
    },
  ];

  return (
    <HoldItem items={menuItems}>
      <Cover uri={mangaCoverURI} fixedSize />
    </HoldItem>
  );
};

export default React.memo(MangaCover);
