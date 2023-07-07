import Stack from '@components/Stack';
import Switch from '@components/Switch';
import Text from '@components/Text';
import React from 'react';
import connector, {
  ConnectedShowPageNumberProps,
} from './ShowPageNumber.redux';
import Box from '@components/Box/Box';
import { useTheme } from '@emotion/react';
import { Pressable } from 'react-native';

const ShowPageNumber: React.FC<ConnectedShowPageNumberProps> = (props) => {
  const { toggleShowPageNumber, showPageNumber } = props;
  const theme = useTheme();
  function handleOnChange() {
    toggleShowPageNumber();
  }
  return (
    <Pressable
      android_ripple={{ color: theme.palette.action.ripple }}
      onPress={handleOnChange}
    >
      <Stack
        justify-content="space-between"
        space="s"
        flex-direction="row"
        p="m"
      >
        <Box align-self="center">
          <Text>Show page number</Text>
          <Text color="textSecondary" variant="body-sub">
            Shows the current page number
          </Text>
        </Box>
        <Box align-self="center">
          <Switch enabled={showPageNumber} onChange={handleOnChange} />
        </Box>
      </Stack>
    </Pressable>
  );
};

export default connector(React.memo(ShowPageNumber));
