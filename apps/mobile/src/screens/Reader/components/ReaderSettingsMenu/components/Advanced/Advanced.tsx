import Stack from '@components/Stack';
import ImageComponent from '@screens/Reader/components/ReaderSettingsMenu/components/Advanced/components/ImageComponent/ImageComponent';
import React from 'react';

const Advanced: React.FC = () => {
  return (
    <Stack space="s" mx="m" my="s" flex-direction="column">
      <ImageComponent />
    </Stack>
  );
};

export default React.memo(Advanced);
