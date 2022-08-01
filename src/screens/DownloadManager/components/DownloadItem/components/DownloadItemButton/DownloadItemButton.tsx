import { Flex, Icon, IconButton, MenuOption } from '@components/core';
import generateMenu from '@utils/generateMenu';
import React from 'react';
import { HoldItem } from 'react-native-hold-menu';
import { DownloadItemButtonProps } from './DownloadItemButton.interfaces';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { useTheme } from 'styled-components/native';

const DownloadItemButton: React.FC<DownloadItemButtonProps> = (props) => {
  const { onPress } = props;
  const theme = useTheme();
  return (
    <Flex direction='column' grow alignItems='flex-end'>
      <Menu>
        <MenuTrigger>
          <IconButton onPress={onPress} icon={<Icon bundle='Feather' name='edit' />} />
        </MenuTrigger>
        <MenuOptions customStyles={theme.menuOptionsStyle}>
          <MenuOption text='Cancel all for this series' />
        </MenuOptions>
      </Menu>
    </Flex>
  );
};

export default React.memo(DownloadItemButton);
