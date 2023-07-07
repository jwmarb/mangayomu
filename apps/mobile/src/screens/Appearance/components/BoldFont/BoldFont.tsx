import Stack from '@components/Stack';
import Text from '@components/Text';
import React from 'react';

import { BoldFontProps } from './BoldFont.interfaces';
import Switch from '@components/Switch/Switch';
import { useTheme } from '@emotion/react';
import { Pressable } from 'react-native';

const BoldFont: React.FC<BoldFontProps> = (props) => {
  const { isBold, onToggleBold } = props;
  const theme = useTheme();
  return (
    <Pressable
      android_ripple={{
        color: theme.palette.action.ripple,
      }}
      onPress={onToggleBold}
    >
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
