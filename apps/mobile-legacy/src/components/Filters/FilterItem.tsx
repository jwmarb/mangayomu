import MultiCheckbox from '@components/MultiCheckbox';
import Pressable from '@components/Pressable';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { FilterState } from '@redux/slices/mainSourceSelector';
import { ACCORDION_ITEM_HEIGHT } from '@theme/constants';
import React from 'react';

export interface FilterItemProps<T extends string> {
  state: FilterState;
  title: string;
  itemKey: T;
  onToggle: (itemKey: T) => void;
}

function FilterItem<T extends string>(props: FilterItemProps<T>) {
  function handleOnToggle() {
    props.onToggle(props.itemKey);
  }
  return (
    <Pressable onPress={handleOnToggle}>
      <Stack
        height={ACCORDION_ITEM_HEIGHT}
        space="s"
        mx="s"
        flex-direction="row"
        align-items="center"
      >
        <MultiCheckbox state={props.state} onChange={handleOnToggle} />
        <Text color="textSecondary">{props.title}</Text>
      </Stack>
    </Pressable>
  );
}

export default React.memo(FilterItem) as typeof FilterItem;
