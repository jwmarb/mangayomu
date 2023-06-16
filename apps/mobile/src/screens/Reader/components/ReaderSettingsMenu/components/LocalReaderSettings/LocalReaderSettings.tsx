import Stack from '@components/Stack';
import Text from '@components/Text';
import DeviceOrientation from '@screens/Reader/components/Overlay/components/DeviceOrientation';
import ImageScaling from '@screens/Reader/components/Overlay/components/ImageScaling';
import ReaderDirection from '@screens/Reader/components/Overlay/components/ReaderDirection';
import ZoomStartPosition from '@screens/Reader/components/Overlay/components/ZoomStartPosition';
import React from 'react';
import { LocalReaderSettingsProps } from './LocalReaderSettings.interfaces';
import { MangaKeyContext } from '@screens/Reader/context/MangaKey';

const LocalReaderSettings: React.FC<LocalReaderSettingsProps> = (props) => {
  const { mangaKey } = props;
  return (
    <MangaKeyContext.Provider value={mangaKey}>
      <Stack space="s" mx="m" my="s">
        <Text bold color="textSecondary" variant="book-title">
          FOR THIS SERIES
        </Text>
        <DeviceOrientation type="setting" />
        <ImageScaling type="setting" />
        <ReaderDirection type="setting" />
        <ZoomStartPosition type="setting" />
      </Stack>
    </MangaKeyContext.Provider>
  );
};

export default React.memo(LocalReaderSettings);
