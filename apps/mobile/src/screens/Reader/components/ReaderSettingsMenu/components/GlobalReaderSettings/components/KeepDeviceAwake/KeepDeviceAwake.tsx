import Stack from '@components/Stack';
import Switch from '@components/Switch';
import Text from '@components/Text';
import React from 'react';
import Box from '@components/Box/Box';
import Pressable from '@components/Pressable';
import { toggleKeepDeviceAwake } from '@redux/slices/settings';
import { useAppDispatch } from '@redux/main';
import useAppSelector from '@hooks/useAppSelector';

function KeepDeviceAwake() {
  const dispatch = useAppDispatch();
  const keepDeviceAwake = useAppSelector(
    (state) => state.settings.reader.keepDeviceAwake,
  );
  function handleOnChange() {
    dispatch(toggleKeepDeviceAwake());
  }
  return (
    <Pressable onPress={handleOnChange}>
      <Stack
        justify-content="space-between"
        space="s"
        flex-direction="row"
        p="m"
      >
        <Box align-self="center">
          <Text>Keep device awake</Text>
          <Text color="textSecondary" variant="body-sub">
            Prevents your screen from turning off
          </Text>
        </Box>
        <Box align-self="center">
          <Switch enabled={keepDeviceAwake} onChange={handleOnChange} />
        </Box>
      </Stack>
    </Pressable>
  );
}

export default React.memo(KeepDeviceAwake);
