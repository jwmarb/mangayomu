import Stack from '@components/Stack';
import Switch from '@components/Switch';
import Text from '@components/Text';
import React from 'react';
import connector, {
  ConnectedNotifyOnLastChapterProps,
} from './NotifyOnLastChapter.redux';
import Box from '@components/Box/Box';

const NotifyOnLastChapter: React.FC<ConnectedNotifyOnLastChapterProps> = (
  props,
) => {
  const { notifyOnLastChapter, toggleNotifyOnLastChapter } = props;
  function handleOnChange() {
    toggleNotifyOnLastChapter();
  }
  return (
    <Stack space="s" justify-content="space-between" flex-direction="row">
      <Box flex-shrink align-self="flex-end">
        <Text>Last chapter reminder</Text>
        <Text variant="body-sub" color="textSecondary">
          Displays a message when you reach the last chapter of a manga
        </Text>
      </Box>
      <Switch enabled={notifyOnLastChapter} onChange={handleOnChange} />
    </Stack>
  );
};

export default connector(React.memo(NotifyOnLastChapter));
