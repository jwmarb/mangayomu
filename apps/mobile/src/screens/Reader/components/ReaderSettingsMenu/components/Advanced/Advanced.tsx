import Button from '@components/Button';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { ReaderImageComponent } from '@redux/slices/settings';
import ImageComponent from '@screens/Reader/components/ReaderSettingsMenu/components/Advanced/components/ImageComponent/ImageComponent';
import React from 'react';
import connector, { ConnectedAdvancedProps } from './Advanced.redux';

const Advanced: React.FC = () => {
  return (
    <Stack space="s" mx="m" my="s" flex-direction="column">
      <ImageComponent />
    </Stack>
  );
};

export default React.memo(Advanced);
