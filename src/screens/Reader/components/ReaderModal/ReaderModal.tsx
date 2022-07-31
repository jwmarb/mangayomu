import React from 'react';
import { Icon, List, ListItem, ListSection, Modal, Typography } from '@components/core';
import connector, { ConnectedReaderModalProps } from './ReaderModal.redux';
import { convertToURI } from '@screens/MangaViewer/components/MangaCover/MangaCover.helpers';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Clipboard from 'expo-clipboard';
import displayMessage from '@utils/displayMessage';
import { LayoutChangeEvent, useWindowDimensions } from 'react-native';
import { useTheme } from 'styled-components/native';
import pixelToNumber from '@utils/pixelToNumber';
const ReaderModal: React.FC<ConnectedReaderModalProps> = (props) => {
  const { visible, onClose, uri, manga } = props;
  const { height: windowHeight } = useWindowDimensions();
  const layoutHeight = React.useRef<number>(0);
  const [height, setHeight] = React.useState<number>(0);
  const theme = useTheme();
  const handleOnLayout = (e: LayoutChangeEvent) => {
    layoutHeight.current = e.nativeEvent.layout.height;
    setHeight(windowHeight - e.nativeEvent.layout.height - pixelToNumber(theme.spacing(2)));
  };
  React.useEffect(() => {
    setHeight(windowHeight - layoutHeight.current - pixelToNumber(theme.spacing(2)));
  }, [windowHeight]);
  const handleOnSave = async () => {
    if (uri) {
      try {
        const fileName = await convertToURI(manga.title + '-' + uri, uri);
        const { uri: imageUri } = await FileSystem.downloadAsync(uri, `${FileSystem.documentDirectory}${fileName}`);
        const response = await MediaLibrary.requestPermissionsAsync(true);
        if (response.granted) {
          await MediaLibrary.saveToLibraryAsync(imageUri);
          displayMessage('Image saved.');
        } else displayMessage('Failed to save image due to insufficient permissions.');
      } catch (e) {
        displayMessage(e as any);
      }
    }
    onClose();
  };
  const handleOnCopyImageLink = async () => {
    if (uri) {
      try {
        await Clipboard.setStringAsync(uri);
        displayMessage('Copied to clipboard.');
      } catch (e) {
        displayMessage(e as any);
      }
    }
    onClose();
  };
  return (
    <Modal disablePanning minimumHeight={height} visible={visible} onClose={onClose} backgroundColor='paper'>
      <List onLayout={handleOnLayout}>
        <ListSection title='Actions' />
        <ListItem title='Save' adornment={<Icon bundle='Feather' name='save' />} paper onPress={handleOnSave} />
        <ListItem
          title='Copy Image URL'
          adornment={<Icon bundle='Feather' name='link' />}
          paper
          onPress={handleOnCopyImageLink}
        />
      </List>
    </Modal>
  );
};

export default connector(React.memo(ReaderModal));
