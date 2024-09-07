import Switch from '@/components/primitives/Switch';
import MiscellaneousOption from '@/screens/ReaderSettings/components/primitives/MiscellaneousOption';
import { useSettingsStore } from '@/stores/settings';

export default function ToggleStatusBar() {
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
    <MiscellaneousOption onPress={handleOnValueChange}>
      <MiscellaneousOption.Title
        title="Immersive mode"
        description="For an immersive reading experience similar to watching a video in
          fullscreen, the status/navigation bar is hidden."
      />
      <MiscellaneousOption.Content>
        <Switch value={isEnabled} onValueChange={handleOnValueChange} />
      </MiscellaneousOption.Content>
    </MiscellaneousOption>
  );
}
