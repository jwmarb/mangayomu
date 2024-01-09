import Box from '@components/Box';
import Checkbox from '@components/Checkbox';
import Pressable from '@components/Pressable';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { ACCORDION_ITEM_HEIGHT } from '@theme/constants';
import React from 'react';

export interface CheckboxItemProps<T extends string> {
  title: string;
  subtitle?: string;
  itemKey: T;
  checked: boolean;
  onToggle: (itemKey: T) => void;
}

function CheckboxItem<T extends string>(props: CheckboxItemProps<T>) {
  function handleOnToggle() {
    props.onToggle(props.itemKey);
  }
  return (
    <Pressable onPress={handleOnToggle}>
      <Stack
        p="s"
        space="s"
        height={ACCORDION_ITEM_HEIGHT}
        flex-direction="row"
        align-items="center"
      >
        <Box>
          <Checkbox checked={props.checked} onChange={handleOnToggle} />
        </Box>
        <Stack space="s" flex-direction="row" align-self="center">
          <Text color="textSecondary">{props.title}</Text>
          <Text color="disabled">{props.subtitle}</Text>
        </Stack>
      </Stack>
    </Pressable>
  );
}

export default React.memo(CheckboxItem) as typeof CheckboxItem;
