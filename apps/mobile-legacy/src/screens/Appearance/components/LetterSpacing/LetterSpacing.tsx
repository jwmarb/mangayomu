import Box from '@components/Box';
import Checkbox from '@components/Checkbox';
import Slider from '@components/Slider';
import Stack from '@components/Stack';
import Text from '@components/Text';
import React from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import type { LetterSpacingProps } from './';
import useAppSelector from '@hooks/useAppSelector';

const LetterSpacing: React.FC<LetterSpacingProps> = (props) => {
  const {
    onChangeLetterSpacing,
    onToggleAutoLetterSpacing,
    // autoLetterSpacing,
    letterSpacing,
  } = props;
  const autoLetterSpacing = useAppSelector(
    (state) => state.settings.book.title.autoLetterSpacing,
  );
  return (
    <Box px="l" py="s">
      <Stack space="s" flex-direction="row" align-items="center">
        <Text>Letter spacing</Text>
        <Box flex-direction="row" align-items="center">
          <Checkbox
            checked={autoLetterSpacing}
            onChange={onToggleAutoLetterSpacing}
          />
          <TouchableWithoutFeedback onPress={onToggleAutoLetterSpacing}>
            <Text variant="book-title" color="textSecondary">
              Auto
            </Text>
          </TouchableWithoutFeedback>
        </Box>
      </Stack>
      {!autoLetterSpacing && (
        <Slider
          min={-2}
          max={1}
          onChange={onChangeLetterSpacing}
          defaultValue={letterSpacing.value}
        />
      )}
    </Box>
  );
};

export default React.memo(LetterSpacing);
