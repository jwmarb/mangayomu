import { useReaderContext } from '@screens/Reader/Reader';
import React from 'react';
import connector, {
  ConnectedReaderDirectionProps,
} from './ReaderDirection.redux';
import Realm from 'realm';
import { Menu, MenuItem } from '@components/Menu';
import IconButton from '@components/IconButton';
import Icon from '@components/Icon';
import { ReadingDirection, useReaderSetting } from '@redux/slices/settings';
import {
  OVERLAY_TEXT_PRIMARY,
  OVERLAY_TEXT_SECONDARY,
} from '@screens/Reader/components/Overlay/Overlay';
import Stack from '@components/Stack';
import Text from '@components/Text';
import Button from '@components/Button';

const ReaderDirection: React.FC<ConnectedReaderDirectionProps> = (props) => {
  const {
    globalReadingDirection,
    type = 'button',
    setGlobalReadingDirection,
  } = props;
  const { mangaKey } = useReaderContext();
  const set = React.useCallback(
    (val: ReadingDirection | 'Use global setting') => {
      if (val !== 'Use global setting') setGlobalReadingDirection(val);
    },
    [setGlobalReadingDirection],
  );
  const [readingDirection, setReadingDirection] = useReaderSetting(
    'readerDirection',
    globalReadingDirection,
    mangaKey ?? set,
  );

  if (type === 'button')
    return (
      <Menu
        trigger={
          <IconButton
            icon={<Icon type="font" name="book-open-variant" />}
            color={OVERLAY_TEXT_SECONDARY}
          />
        }
      >
        {Object.entries(ReadingDirection).map(([key, value]) => (
          <MenuItem
            key={key}
            optionKey={value as ReadingDirection}
            onSelect={setReadingDirection}
            color={value === readingDirection ? 'primary' : undefined}
          >
            {value}
          </MenuItem>
        ))}
        {mangaKey != null && (
          <MenuItem
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            optionKey={'Use global setting' as any}
            onSelect={setReadingDirection}
            color={
              readingDirection === 'Use global setting' ? 'primary' : undefined
            }
          >
            Use global setting
          </MenuItem>
        )}
      </Menu>
    );

  return (
    <Stack
      flex-direction="row"
      space="s"
      justify-content="space-between"
      align-items="center"
    >
      <Text>Reading direction</Text>
      <Menu
        trigger={
          <Button
            label={readingDirection}
            icon={<Icon type="font" name="chevron-down" />}
            iconPlacement="right"
          />
        }
      >
        {Object.entries(ReadingDirection).map(([key, value]) => (
          <MenuItem
            key={key}
            optionKey={value as ReadingDirection}
            onSelect={setReadingDirection}
            color={value === readingDirection ? 'primary' : undefined}
          >
            {value}
          </MenuItem>
        ))}
        {mangaKey != null && (
          <MenuItem
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            optionKey={'Use global setting' as any}
            onSelect={setReadingDirection}
            color={
              readingDirection === 'Use global setting' ? 'primary' : undefined
            }
          >
            Use global setting
          </MenuItem>
        )}
      </Menu>
    </Stack>
  );
};

export default connector(React.memo(ReaderDirection));
