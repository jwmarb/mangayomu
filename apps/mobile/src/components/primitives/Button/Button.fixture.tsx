import { ScrollView } from 'react-native';
import { useSelect } from 'react-cosmos/client';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/primitives/Button';
import { createStyles } from '@/utils/theme';
import useStyles from '@/hooks/useStyles';
import useModeSelect from '@/hooks/useModeSelect';
import Contrast from '@/components/primitives/Contrast';
import { BUTTON_COLORS, ButtonColors } from '@/components/primitives/types';

const styles = createStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.palette.background.default,
  },
  content: {
    gap: theme.style.size.l,
    padding: theme.style.size.xl,
    justifyContent: 'center',
  },
  padding: {
    padding: theme.style.size.l,
  },
}));

export default function ButtonFixture() {
  const mode = useModeSelect();
  const style = useStyles(styles, mode);
  const [color] = useSelect('color', {
    defaultValue: 'primary',
    options: BUTTON_COLORS as unknown as string[],
  }) as unknown as [ButtonColors];
  const [textAlignment] = useSelect('textAlignment', {
    defaultValue: 'left',
    options: ['left', 'center', 'right'],
  });
  const [disabled] = useSelect('disabled', {
    defaultValue: 'false',
    options: ['true', 'false'],
  });
  return (
    <SafeAreaView style={style.container}>
      <ScrollView contentContainerStyle={style.content}>
        <Contrast contrast={mode}>
          <Button
            title="Contained"
            textAlignment={textAlignment}
            variant="contained"
            color={color}
            disabled={JSON.parse(disabled)}
          />
          <Button
            title="Outlined"
            textAlignment={textAlignment}
            variant="outlined"
            color={color}
            disabled={JSON.parse(disabled)}
          />
          <Button
            title="Text"
            textAlignment={textAlignment}
            color={color}
            disabled={JSON.parse(disabled)}
          />
        </Contrast>
      </ScrollView>
    </SafeAreaView>
  );
}
