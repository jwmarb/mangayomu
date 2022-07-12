import { Flex, Icon, IconButton } from '@components/core';
import React from 'react';
import { HoldItem } from 'react-native-hold-menu';
import { DownloadItemButtonProps } from './DownloadItemButton.interfaces';

const DownloadItemButton: React.FC<DownloadItemButtonProps> = (props) => {
  const { onPress } = props;
  return (
    <Flex direction='column' grow alignItems='flex-end'>
      <IconButton onPress={onPress} icon={<Icon bundle='Feather' name='edit' />} />
    </Flex>
  );
};

export default React.memo(DownloadItemButton);
