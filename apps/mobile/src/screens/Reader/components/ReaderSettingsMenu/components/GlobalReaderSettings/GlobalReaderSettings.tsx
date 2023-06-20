import Box from '@components/Box';
import Divider from '@components/Divider';
import Stack from '@components/Stack';
import Text from '@components/Text';
import DeviceOrientation from '@screens/Reader/components/Overlay/components/DeviceOrientation';
import ImageScaling from '@screens/Reader/components/Overlay/components/ImageScaling';
import ReaderDirection from '@screens/Reader/components/Overlay/components/ReaderDirection';
import ZoomStartPosition from '@screens/Reader/components/Overlay/components/ZoomStartPosition';
import AutoFetch from '@screens/Reader/components/ReaderSettingsMenu/components/GlobalReaderSettings/components/AutoFetch/AutoFetch';
import BackgroundColor from '@screens/Reader/components/ReaderSettingsMenu/components/GlobalReaderSettings/components/BackgroundColor';
import NotifyOnLastChapter from '@screens/Reader/components/ReaderSettingsMenu/components/GlobalReaderSettings/components/NotifyOnLastChapter';
import ShowPageNumber from '@screens/Reader/components/ReaderSettingsMenu/components/GlobalReaderSettings/components/ShowPageNumber';
import React from 'react';

const GlobalReaderSettings: React.FC = () => {
  return (
    <>
      <Box mx="m">
        <Text bold variant="header">
          Global
        </Text>
        <Text color="textSecondary">
          Settings that will apply to all mangas by default
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
        <ImageScaling type="setting" />
        <ReaderDirection type="setting" />
        <ZoomStartPosition type="setting" />
      </Box>
      <Divider />
      <Box pt="m" px="m">
        <Text bold variant="header">
          Miscellaneous
        </Text>
        <Text color="textSecondary">Customize functionality and features</Text>
      </Box>
      <Box
        m="m"
        overflow="hidden"
        background-color="paper"
        border-color="@theme"
        border-radius="@theme"
        border-width="@theme"
      >
        <BackgroundColor />
        <Divider />
        <ShowPageNumber />
        <Divider />
        <NotifyOnLastChapter />
        <Divider />
        <AutoFetch />
      </Box>
    </>
  );
};

export default React.memo(GlobalReaderSettings);
