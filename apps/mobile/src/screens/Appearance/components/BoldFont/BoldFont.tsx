import Checkbox from '@components/Checkbox';
import Stack from '@components/Stack';
import Text from '@components/Text';
import React from 'react';
import {
  RectButton,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { BoldFontProps } from './BoldFont.interfaces';
import Switch from '@components/Switch/Switch';
import { useTheme } from '@emotion/react';

const BoldFont: React.FC<BoldFontProps> = (props) => {
  const { isBold, onToggleBold } = props;
  const theme = useTheme();
  return (
    <RectButton
      rippleColor={theme.palette.action.ripple}
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
        <TouchableWithoutFeedback onPress={onToggleBold}>
          <Text>Bold font</Text>
        </TouchableWithoutFeedback>
        <Switch onChange={onToggleBold} enabled={isBold} />
      </Stack>
    </RectButton>
  );
};

export default React.memo(BoldFont);
