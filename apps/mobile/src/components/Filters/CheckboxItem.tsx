import Box from '@components/Box';
import Checkbox from '@components/Checkbox';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import React from 'react';
import { RectButton } from 'react-native-gesture-handler';

export interface CheckboxItemProps<T extends string> {
  title: string;
  itemKey: T;
  checked: boolean;
  onToggle: (itemKey: T) => void;
}

function CheckboxItem<T extends string>(props: CheckboxItemProps<T>) {
  const theme = useTheme();
  function handleOnToggle() {
    props.onToggle(props.itemKey);
  }
  return (
    <RectButton
      onPress={handleOnToggle}
      rippleColor={theme.palette.action.ripple}
    >
      <Stack p="s" space="s" flex-direction="row" align-items="center">
        <Box>
          <Checkbox checked={props.checked} onChange={handleOnToggle} />
        </Box>
        <Text color="textSecondary">{props.title}</Text>
      </Stack>
    </RectButton>
  );
}

export default React.memo(CheckboxItem) as typeof CheckboxItem;