import Stack from '@components/Stack';
import Switch from '@components/Switch';
import Text from '@components/Text';
import React from 'react';
import connector, {
  ConnectedShowPageNumberProps,
} from './ShowPageNumber.redux';

const ShowPageNumber: React.FC<ConnectedShowPageNumberProps> = (props) => {
  const { toggleShowPageNumber, showPageNumber } = props;
  function handleOnChange() {
    toggleShowPageNumber();
  }
  return (
    <Stack
      align-items="center"
      justify-content="space-between"
      space="s"
      flex-direction="row"
    >
      <Text>Show page number</Text>
      <Switch enabled={showPageNumber} onChange={handleOnChange} />
    </Stack>
  );
};

export default connector(React.memo(ShowPageNumber));
