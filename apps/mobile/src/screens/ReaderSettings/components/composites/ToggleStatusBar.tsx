import Pressable from '@/components/primitives/Pressable';
import Switch from '@/components/primitives/Switch';
import Text from '@/components/primitives/Text';
import useBoolean from '@/hooks/useBoolean';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import useTheme from '@/hooks/useTheme';
import { useSettingsStore } from '@/stores/settings';
import { createStyles } from '@/utils/theme';
import { View } from 'react-native';

const styles = createStyles((theme) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.style.size.m,
    paddingHorizontal: theme.style.screen.paddingHorizontal,
    paddingVertical: theme.style.screen.paddingVertical,
  },
  title: {
    flexShrink: 1,
  },
}));

export default function ToggleStatusBar() {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const isEnabled = useSettingsStore(
    (selector) => selector.reader.hideStatusBar,
  );
  const setReaderState = useSettingsStore(
    (selector) => selector.setReaderState,
  );
  function handleOnValueChange() {
    setReaderState('hideStatusBar', !isEnabled);
  }
  return (
    <Pressable style={style.container} onPress={handleOnValueChange}>
      <View style={style.title}>
        <Text variant="h4">Immersive mode</Text>
        <Text color="textSecondary">
          For an immersive reading experience similar to watching a video in
          fullscreen, the status/navigation bar is hidden.
        </Text>
      </View>
      <Switch value={isEnabled} onValueChange={handleOnValueChange} />
    </Pressable>
  );
}
