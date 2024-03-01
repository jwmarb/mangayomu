import React from 'react';
import Text, {
  TEXT_ALIGNMENTS,
  TEXT_COLORS,
  TEXT_VARIANTS,
  TextAlignments,
  TextColors,
  TextVariants,
} from './Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelect, useValue } from 'react-cosmos/client';
import useModeSelect from '../../hooks/useModeSelect';
import { createStyles } from '../../utils/theme';
import useStyles from '../../hooks/useStyles';

const PANGRAM = 'The quick brown fox jumps over the lazy dog';

const styles = createStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.palette.background.default,
    justifyContent: 'center',
  },
}));

export default function TextFixture() {
  const [variant] = useSelect('variant', {
    options: TEXT_VARIANTS as unknown as string[],
  });
  const [color] = useSelect('color', {
    options: TEXT_COLORS as unknown as string[],
    defaultValue: 'textPrimary',
  });
  const [text] = useValue('text', {
    defaultValue: PANGRAM,
  });
  const [alignment] = useSelect('alignment', {
    options: TEXT_ALIGNMENTS as unknown as string[],
    defaultValue: 'left',
  });
  const contrast = useModeSelect();
  const style = useStyles(styles, contrast);
  return (
    <SafeAreaView style={style.container}>
      <Text
        color={color as TextColors}
        contrast={contrast}
        variant={variant as TextVariants}
        alignment={alignment as TextAlignments}
      >
        {variant}. {text}
      </Text>
    </SafeAreaView>
  );
}
