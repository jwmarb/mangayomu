import Stack from '@components/Stack';
import Switch from '@components/Switch';
import Text from '@components/Text';
import React from 'react';
import connector, {
  ConnectedShowPageNumberProps,
} from './ShowPageNumber.redux';
import Box from '@components/Box/Box';

const ShowPageNumber: React.FC<ConnectedShowPageNumberProps> = (props) => {
  const { toggleShowPageNumber, showPageNumber } = props;
  function handleOnChange() {
    toggleShowPageNumber();
  }
  return (
    <Stack justify-content="space-between" space="s" flex-direction="row">
      <Box align-self="flex-end">
        <Text>Show page number</Text>
        <Text color="textSecondary" variant="body-sub">
          Allows you to see the current page number
        </Text>
      </Box>
      <Switch enabled={showPageNumber} onChange={handleOnChange} />
    </Stack>
  );
};

export default connector(React.memo(ShowPageNumber));
