import Stack from '@components/Stack';
import Text from '@components/Text';
import React from 'react';

import { BoldFontProps } from './BoldFont.interfaces';
import Switch from '@components/Switch/Switch';
import useAppSelector from '@hooks/useAppSelector';
import { toggleBoldTitleFont } from '@redux/slices/settings';
import { useAppDispatch } from '@redux/main';
import Pressable from '@components/Pressable';

const BoldFont: React.FC = () => {
  const isBold = useAppSelector((state) => state.settings.book.title.bold);
  const dispatch = useAppDispatch();
  const onToggleBold = () => dispatch(toggleBoldTitleFont());
  return (
    <Pressable onPress={onToggleBold}>
      <Stack
        px="l"
        py="s"
        space="s"
        flex-direction="row"
        align-items="center"
        justify-content="space-between"
      >
        <Pressable onPress={onToggleBold}>
          <Text>Bold font</Text>
        </Pressable>
        <Switch onChange={onToggleBold} enabled={isBold} />
      </Stack>
    </Pressable>
  );
};

export default React.memo(BoldFont);
