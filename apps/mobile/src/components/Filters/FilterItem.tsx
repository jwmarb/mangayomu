import MultiCheckbox from '@components/MultiCheckbox';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import { FilterState } from '@redux/slices/mainSourceSelector';
import { ACCORDION_ITEM_HEIGHT } from '@theme/constants';
import React from 'react';
import { RectButton } from 'react-native-gesture-handler';

export interface FilterItemProps<T extends string> {
  state: FilterState;
  title: string;
  itemKey: T;
  onToggle: (itemKey: T) => void;
}

function FilterItem<T extends string>(props: FilterItemProps<T>) {
  const theme = useTheme();
  function handleOnToggle() {
    props.onToggle(props.itemKey);
  }
  return (
    <RectButton
      onPress={handleOnToggle}
      rippleColor={theme.palette.action.ripple}
    >
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
    </RectButton>
  );
}

export default React.memo(FilterItem) as typeof FilterItem;
