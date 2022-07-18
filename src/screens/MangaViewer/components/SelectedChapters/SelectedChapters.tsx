import { Button, Divider, Flex, Icon, MenuTitle, Spacer, Typography, MenuOption } from '@components/core';
import FloatingModal from '@components/FloatingModal';
import useIsMounted from '@hooks/useIsMounted';
import useMountedEffect from '@hooks/useMountedEffect';
import { useIsFocused } from '@react-navigation/native';
import { cursors } from '@redux/reducers/chaptersListReducer/chaptersListReducer.actions';
import connector, {
  SelectedChaptersProps,
} from '@screens/MangaViewer/components/SelectedChapters/SelectedChapters.redux';
import displayMessage from '@utils/displayMessage';
import DownloadManager, { DownloadStatus } from '@utils/DownloadManager';
import React from 'react';
import { HoldItem } from 'react-native-hold-menu';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { useTheme } from 'styled-components/native';

function plural(n: number) {
  return n !== 1 ? 's' : '';
}

const SelectedChapters: React.FC<SelectedChaptersProps> = (props) => {
  const {
    selectedChapters,
    checkAll,
    selectionMode,
    numOfChapters,
    exitSelectionMode,
    manga,
    downloadSelected,
    numOfSelected,
    hidden,
  } = props;

  const isFocused = useIsFocused();
  const pluralized = plural(numOfSelected);
  const mounted = useIsMounted();
  const theme = useTheme();
  const ref = React.useRef<Menu>(null);

  const handleOnDownloadAllSelected = React.useCallback(() => {
    downloadSelected(selectedChapters, manga);
  }, []);

  function handleOnPress() {
    ref.current?.open();
  }
  if (isFocused && mounted)
    return (
      <FloatingModal visible={selectionMode === 'selection' && !hidden}>
        <Flex alignItems='center' justifyContent='space-between'>
          <Typography color='textSecondary'>
            Selected <Typography bold>{numOfSelected}</Typography> Chapter{pluralized}
          </Typography>
          <Spacer x={2} />
          <Flex>
            {numOfSelected > 0 ? (
              <Menu ref={ref}>
                <MenuTrigger>
                  <Button title='Actions' onPress={handleOnPress} />
                </MenuTrigger>
                <MenuOptions customStyles={theme.menuOptionsStyle}>
                  <MenuTitle>
                    Actions ({numOfSelected} of {numOfChapters})
                  </MenuTitle>

                  <MenuOption
                    onPress={handleOnDownloadAllSelected}
                    text='Download selected'
                    icon={<Icon bundle='Feather' name='download' />}
                  />
                  <Divider />
                  <MenuOption text='Verify file integrity' icon={<Icon bundle='Feather' name='file' />} />
                </MenuOptions>
              </Menu>
            ) : (
              <Button title='Actions' disabled />
            )}
            <Spacer x={1} />
            <Button title='Exit' color='secondary' onPress={exitSelectionMode} />
          </Flex>
        </Flex>
      </FloatingModal>
    );
  return null;
};

export default connector(React.memo(SelectedChapters));
