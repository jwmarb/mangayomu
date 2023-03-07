import Checkbox from '@components/Checkbox';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import React from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { BoldFontProps } from './BoldFont.interfaces';

const BoldFont: React.FC<BoldFontProps> = (props) => {
  const { isBold, onToggleBold } = props;
  return (
    <Stack space="s" flex-direction="row" align-items="center">
      <TouchableWithoutFeedback onPress={onToggleBold}>
        <Text>Bold font</Text>
      </TouchableWithoutFeedback>
      <Checkbox onChange={onToggleBold} checked={isBold} />
    </Stack>
  );
};

export default React.memo(BoldFont);
