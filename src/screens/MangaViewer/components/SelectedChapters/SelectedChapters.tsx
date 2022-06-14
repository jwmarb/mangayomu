import { Button, Flex, Spacer, Typography } from '@components/core';
import FloatingModal from '@components/FloatingModal';
import { useIsFocused } from '@react-navigation/native';
import { cursors } from '@redux/reducers/chaptersListReducer/chaptersListReducer.actions';
import connector, {
  SelectedChaptersProps,
} from '@screens/MangaViewer/components/SelectedChapters/SelectedChapters.redux';
import displayMessage from '@utils/displayMessage';
import { DownloadStatus } from '@utils/DownloadManager';
import React from 'react';
import { HoldItem } from 'react-native-hold-menu';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';

function plural(n: number) {
  return n !== 1 ? 's' : '';
}

const SelectedChapters: React.FC<SelectedChaptersProps> = (props) => {
  const {
    selectedChapters,
    checkAll,
    selectionMode,
    totalChapters,
    exitSelectionMode,
    queueAllSelected,
    pauseAllSelected,
    downloadAllSelected,
    manga,
  } = props;
  const isFocused = useIsFocused();
  const selectedLength = Object.keys(selectedChapters).length;
  const pluralized = plural(selectedLength);
  const [status, setStatus] = React.useState<DownloadStatus>(DownloadStatus.IDLE);
  React.useEffect(() => {
    (async () => {
      switch (status) {
        case DownloadStatus.START_DOWNLOADING:
          displayMessage(`Downloading ${selectedLength} item${pluralized}`);
          setStatus(DownloadStatus.IDLE);
          await downloadAllSelected(selectedChapters, manga);
          break;
      }
    })();
  }, [status]);
  const menuItems: MenuItemProps[] = [
    { text: `Actions (${selectedLength} of ${totalChapters})`, isTitle: true, withSeparator: true },
    {
      text: `Download selected`,
      icon: 'download',
      onPress: () => {
        if (cursors[manga.title] == null) {
          setStatus(DownloadStatus.START_DOWNLOADING);
        } else console.log(`Already existing cursor. Cancel it first.`);
      },
    },

    {
      text: `Verify file integrity`,
      icon: 'file',
      onPress: () => {
        console.log(`Verifying integrity of ${selectedLength} chapter${pluralized}`);
      },
    },
  ] as MenuItemProps[];
  return (
    <FloatingModal visible={selectionMode === 'selection' && isFocused}>
      <Flex alignItems='center' justifyContent='space-between'>
        <Typography color='textSecondary'>
          Selected <Typography bold>{selectedLength}</Typography> Chapter{pluralized}
        </Typography>
        <Spacer x={2} />
        <Flex>
          {selectedLength > 0 ? (
            <HoldItem activateOn='tap' bottom items={menuItems}>
              <Button title='Actions' />
            </HoldItem>
          ) : (
            <Button title='Actions' disabled />
          )}
          <Spacer x={1} />
          <Button title='Exit' color='secondary' onPress={exitSelectionMode} />
        </Flex>
      </Flex>
    </FloatingModal>
  );
};

export default connector(React.memo(SelectedChapters));
