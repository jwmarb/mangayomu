import Stack from '@components/Stack';
import Text from '@components/Text';
import DeviceOrientation from '@screens/Reader/components/Overlay/components/DeviceOrientation';
import ImageScaling from '@screens/Reader/components/Overlay/components/ImageScaling';
import ReaderDirection from '@screens/Reader/components/Overlay/components/ReaderDirection';
import ZoomStartPosition from '@screens/Reader/components/Overlay/components/ZoomStartPosition';
import React from 'react';
import { LocalReaderSettingsProps } from './LocalReaderSettings.interfaces';
import { MangaKeyContext } from '@screens/Reader/context/MangaKey';
import Box from '@components/Box/Box';
import { useManga } from '@database/schemas/Manga';
import Divider from '@components/Divider/Divider';

const LocalReaderSettings: React.FC<LocalReaderSettingsProps> = (props) => {
  const { mangaKey } = props;
  const { manga } = useManga(mangaKey, { preferLocal: true });
  return (
    <MangaKeyContext.Provider value={mangaKey}>
      <Box mx="m" mt="m">
        <Text bold variant="header">
          For this series
        </Text>
        <Text color="textSecondary" italic>
          {manga?.title}
        </Text>
      </Box>
      <Box
        m="m"
        overflow="hidden"
        background-color="paper"
        border-color="@theme"
        border-radius="@theme"
        border-width="@theme"
      >
        <DeviceOrientation type="setting" />
        <Divider />
        <ImageScaling type="setting" />
        <Divider />
        <ReaderDirection type="setting" />
        <Divider />
        <ZoomStartPosition type="setting" />
      </Box>
    </MangaKeyContext.Provider>
  );
};

export default React.memo(LocalReaderSettings);
