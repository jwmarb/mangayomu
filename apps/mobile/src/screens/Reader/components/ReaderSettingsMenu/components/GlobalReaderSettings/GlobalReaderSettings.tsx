import Divider from '@components/Divider';
import Stack from '@components/Stack';
import Text from '@components/Text';
import DeviceOrientation from '@screens/Reader/components/Overlay/components/DeviceOrientation';
import ImageScaling from '@screens/Reader/components/Overlay/components/ImageScaling';
import ReaderDirection from '@screens/Reader/components/Overlay/components/ReaderDirection';
import ZoomStartPosition from '@screens/Reader/components/Overlay/components/ZoomStartPosition';
import BackgroundColor from '@screens/Reader/components/ReaderSettingsMenu/components/GlobalReaderSettings/components/BackgroundColor';
import NotifyOnLastChapter from '@screens/Reader/components/ReaderSettingsMenu/components/GlobalReaderSettings/components/NotifyOnLastChapter';
import ShowPageNumber from '@screens/Reader/components/ReaderSettingsMenu/components/GlobalReaderSettings/components/ShowPageNumber';
import React from 'react';

const GlobalReaderSettings: React.FC = () => {
  return (
    <>
      <Stack space="s" mx="m" my="s">
        <Text bold color="textSecondary" variant="book-title">
          GLOBAL
        </Text>
        <DeviceOrientation type="setting" />
        <ImageScaling type="setting" />
        <ReaderDirection type="setting" />
        <ZoomStartPosition type="setting" />
      </Stack>
      <Divider />
      <Stack space="s" mx="m" my="s">
        <Text bold color="textSecondary" variant="book-title">
          MISCELLANEOUS
        </Text>
        <BackgroundColor />
        <ShowPageNumber />
        <NotifyOnLastChapter />
      </Stack>
    </>
  );
};

export default React.memo(GlobalReaderSettings);
