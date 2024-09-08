import Menu, { MenuCallback } from '@/components/composites/Menu';
import Button from '@/components/primitives/Button';
import Switch from '@/components/primitives/Switch';
import TextInput from '@/components/primitives/TextInput';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import useUserInput from '@/hooks/useUserInput';
import MiscellaneousOption from '@/screens/ReaderSettings/components/primitives/MiscellaneousOption';
import { FetchAheadBehavior, useSettingsStore } from '@/stores/settings';
import { createStyles } from '@/utils/theme';
import React from 'react';

const styles = createStyles((theme) => ({
  subcontainer: {
    paddingLeft: theme.style.screen.paddingHorizontal + theme.style.size.xxl,
    paddingRight: theme.style.screen.paddingHorizontal,
  },
  numpad: {
    width: 64,
  },
}));

export default function FetchAhead() {
  const isActive = useSettingsStore((store) => store.reader.shouldFetchAhead);
  const fetchAheadBehavior = useSettingsStore(
    (store) => store.reader.fetchAheadBehavior,
  );
  const fetchAheadPageOffset = useSettingsStore(
    (store) => store.reader.fetchAheadPageOffset,
  );
  const setReaderState = useSettingsStore((store) => store.setReaderState);
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const { input, setInput } = useUserInput(
    fetchAheadPageOffset + '',
    (sanitizedInput) => {
      if (!sanitizedInput) {
        return sanitizedInput;
      }

      const replaced = sanitizedInput.replace(/[^0-9]/g, '');
      const value = parseInt(replaced);

      setReaderState('fetchAheadPageOffset', value);
      return value + '';
    },
  );

  function toggle(value: boolean) {
    setReaderState('shouldFetchAhead', value);
  }

  function handleOnPress() {
    toggle(!isActive);
  }

  function handleOnBlur() {
    if (input.length === 0) {
      setInput('1');
    }
  }

  const onMenuItem = React.useCallback(
    (item: string) => {
      setReaderState('fetchAheadBehavior', item as FetchAheadBehavior);
    },
    [setReaderState],
  );

  return (
    <>
      <MiscellaneousOption onPress={handleOnPress}>
        <MiscellaneousOption.Title
          title="Fetch Ahead"
          description="Fetches the next chapter when you reach a certain point in the current one."
        />
        <MiscellaneousOption.Content>
          <Switch onValueChange={toggle} value={isActive} />
        </MiscellaneousOption.Content>
      </MiscellaneousOption>
      {isActive && (
        <>
          <MiscellaneousOption style={style.subcontainer}>
            <MiscellaneousOption.Title
              title="Fetch behavior"
              description="Determines when and where the next chapter should be fetched"
              isSubtitle
            />
            <MiscellaneousOption.Content>
              <Menu
                trigger={<Button title={fetchAheadBehavior} />}
                onMenuItem={onMenuItem}
              >
                {Object.entries(FetchAheadBehavior).map(([key, value]) => (
                  <Menu.Item
                    key={key}
                    text={value}
                    id={value}
                    color={fetchAheadBehavior === value ? 'primary' : undefined}
                  />
                ))}
              </Menu>
            </MiscellaneousOption.Content>
          </MiscellaneousOption>
        </>
      )}
      {isActive && fetchAheadBehavior !== FetchAheadBehavior.IMMEDIATELY && (
        <MiscellaneousOption style={style.subcontainer}>
          <MiscellaneousOption.Title
            title="Page offset"
            description="Number of pages to reach (from fetch behavior) to initiate a fetch"
            isSubtitle
          />
          <MiscellaneousOption.Content>
            <TextInput
              style={style.numpad}
              value={input}
              onChangeText={setInput}
              keyboardType="number-pad"
              onBlur={handleOnBlur}
              placeholder="3"
            />
          </MiscellaneousOption.Content>
        </MiscellaneousOption>
      )}
    </>
  );
}
