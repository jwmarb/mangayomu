import { Button, Flex, Spacer, Typography } from '@components/core';
import FloatingModal from '@components/FloatingModal';
import useIsMounted from '@hooks/useIsMounted';
import useMountedEffect from '@hooks/useMountedEffect';
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
  const { selectedChapters, checkAll, selectionMode, totalChapters, exitSelectionMode, manga, downloadSelected } =
    props;
  const isFocused = useIsFocused();
  const selectedValues = Object.values(selectedChapters);
  const selectedLength = selectedValues.length;
  const pluralized = plural(selectedLength);
  const mounted = useIsMounted();

  const menuItems = [
    { text: `Actions (${selectedLength} of ${totalChapters})`, isTitle: true, withSeparator: true },
    {
      text: `Download selected`,
      icon: 'download',
      onPress: () => {
        downloadSelected(selectedChapters, manga);
      },
    },
    {
      text: `Verify file integrity`,
      icon: 'file',
      onPress: () => {
        console.log(`Verifying integrity of ${selectedLength} chapter${pluralized}`);
      },
    },
  ];
  if (isFocused && mounted)
    return (
      <FloatingModal visible={selectionMode === 'selection'}>
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
  return null;
};

export default connector(React.memo(SelectedChapters));
