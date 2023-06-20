import Stack from '@components/Stack';
import Switch from '@components/Switch';
import Text from '@components/Text';
import React from 'react';
import connector, {
  ConnectedNotifyOnLastChapterProps,
} from './NotifyOnLastChapter.redux';
import Box from '@components/Box/Box';
import { RectButton } from 'react-native-gesture-handler';
import { useTheme } from '@emotion/react';

const NotifyOnLastChapter: React.FC<ConnectedNotifyOnLastChapterProps> = (
  props,
) => {
  const { notifyOnLastChapter, toggleNotifyOnLastChapter } = props;
  const theme = useTheme();
  function handleOnChange() {
    toggleNotifyOnLastChapter();
  }
  return (
    <RectButton
      rippleColor={theme.palette.action.ripple}
      onPress={handleOnChange}
    >
      <Stack
        space="s"
        justify-content="space-between"
        flex-direction="row"
        p="m"
      >
        <Box flex-shrink align-self="flex-end">
          <Text>Last chapter reminder</Text>
          <Text variant="body-sub" color="textSecondary">
            Displays a message when you reach the last chapter of a manga
          </Text>
        </Box>
        <Switch enabled={notifyOnLastChapter} onChange={handleOnChange} />
      </Stack>
    </RectButton>
  );
};

export default connector(React.memo(NotifyOnLastChapter));
