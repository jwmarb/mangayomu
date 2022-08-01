import React from 'react';
import { Icon, List, ListItem, ListSection, Modal, Typography } from '@components/core';
import connector, { ConnectedReaderModalProps } from './ReaderModal.redux';
import { convertToURI } from '@screens/MangaViewer/components/MangaCover/MangaCover.helpers';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import displayMessage from '@utils/displayMessage';
import { LayoutChangeEvent, useWindowDimensions } from 'react-native';
import { useTheme } from 'styled-components/native';
import pixelToNumber from '@utils/pixelToNumber';
import useMountedEffect from '@hooks/useMountedEffect';
const ReaderModal: React.FC<ConnectedReaderModalProps> = (props) => {
  const { visible, onClose, page, manga, pageNumber } = props;
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
  useMountedEffect(() => {
    Haptics.selectionAsync();
  }, [visible]);
  const handleOnSave = async () => {
    onClose();
    if (page) {
      try {
        const fileName = await convertToURI(
          manga.title +
            '-' +
            `${page.chapter?.name ?? `Chapter ${page.chapter.index + 1}`}` +
            '-' +
            `Page ${pageNumber + 1}`,
          page.uri
        );
        const { uri: imageUri } = await FileSystem.downloadAsync(
          page.uri,
          `${FileSystem.documentDirectory}${fileName}`
        );
        const response = await MediaLibrary.requestPermissionsAsync(true);
        if (response.granted) {
          await MediaLibrary.saveToLibraryAsync(imageUri);
          displayMessage('Image saved.');
        } else displayMessage('Failed to save image due to insufficient permissions.');
      } catch (e) {
        displayMessage(e as any);
      }
    }
  };
  const handleOnCopyImageLink = async () => {
    if (page) {
      try {
        await Clipboard.setStringAsync(page.uri);
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
