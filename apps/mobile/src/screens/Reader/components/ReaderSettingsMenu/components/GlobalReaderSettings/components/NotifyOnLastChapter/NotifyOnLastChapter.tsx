import Stack from '@components/Stack';
import Switch from '@components/Switch';
import Text from '@components/Text';
import React from 'react';
import connector, {
  ConnectedNotifyOnLastChapterProps,
} from './NotifyOnLastChapter.redux';

const NotifyOnLastChapter: React.FC<ConnectedNotifyOnLastChapterProps> = (
  props,
) => {
  const { notifyOnLastChapter, toggleNotifyOnLastChapter } = props;
  function handleOnChange() {
    toggleNotifyOnLastChapter();
  }
  return (
    <Stack
      space="s"
      justify-content="space-between"
      align-items="center"
      flex-direction="row"
    >
      <Text>Notify on last chapter</Text>
      <Switch enabled={notifyOnLastChapter} onChange={handleOnChange} />
    </Stack>
  );
};

export default connector(React.memo(NotifyOnLastChapter));
