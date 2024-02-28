import Stack from '@components/Stack';
import Switch from '@components/Switch';
import Text from '@components/Text';
import React from 'react';
import Box from '@components/Box/Box';
import Pressable from '@components/Pressable';
import { toggleShowPageNumber } from '@redux/slices/settings';
import { useAppDispatch } from '@redux/main';
import useAppSelector from '@hooks/useAppSelector';

const ShowPageNumber: React.FC = () => {
  const dispatch = useAppDispatch();
  const showPageNumber = useAppSelector(
    (state) => state.settings.reader.showPageNumber,
  );
  function handleOnChange() {
    dispatch(toggleShowPageNumber());
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

export default React.memo(ShowPageNumber);
