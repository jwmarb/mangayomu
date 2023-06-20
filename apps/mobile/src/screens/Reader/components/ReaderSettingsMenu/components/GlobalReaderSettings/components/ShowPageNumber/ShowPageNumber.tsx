import Stack from '@components/Stack';
import Switch from '@components/Switch';
import Text from '@components/Text';
import React from 'react';
import connector, {
  ConnectedShowPageNumberProps,
} from './ShowPageNumber.redux';
import Box from '@components/Box/Box';
import { RectButton } from 'react-native-gesture-handler';
import { useTheme } from '@emotion/react';

const ShowPageNumber: React.FC<ConnectedShowPageNumberProps> = (props) => {
  const { toggleShowPageNumber, showPageNumber } = props;
  const theme = useTheme();
  function handleOnChange() {
    toggleShowPageNumber();
  }
  return (
    <RectButton
      rippleColor={theme.palette.action.ripple}
      onPress={handleOnChange}
    >
      <Stack
        justify-content="space-between"
        space="s"
        flex-direction="row"
        p="m"
      >
        <Box align-self="flex-end">
          <Text>Show page number</Text>
          <Text color="textSecondary" variant="body-sub">
            Allows you to see the current page number
          </Text>
        </Box>
        <Switch enabled={showPageNumber} onChange={handleOnChange} />
      </Stack>
    </RectButton>
  );
};

export default connector(React.memo(ShowPageNumber));
