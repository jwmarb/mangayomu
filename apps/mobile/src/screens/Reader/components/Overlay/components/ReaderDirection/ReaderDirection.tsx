import React from 'react';
import connector, {
  ConnectedReaderDirectionProps,
} from './ReaderDirection.redux';
import { Menu, MenuItem } from '@components/Menu';
import Icon from '@components/Icon';
import { ReadingDirection, useReaderSetting } from '@redux/slices/settings';
import Stack from '@components/Stack';
import Text from '@components/Text';
import Button from '@components/Button';
import OverlayBottomButton from '@screens/Reader/components/Overlay/components/OverlayBottomButton';
import Box from '@components/Box/Box';
import { useMangaKey } from '@screens/Reader/context/MangaKey';

const ReaderDirection: React.FC<ConnectedReaderDirectionProps> = (props) => {
  const {
    globalReadingDirection,
    type = 'button',
    setGlobalReadingDirection,
  } = props;
  const mangaKey = useMangaKey();
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
      <Box flex-grow>
        <Menu
          trigger={
            <OverlayBottomButton
              name="book-open-variant"
              settingName="Reader direction"
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
                readingDirection === 'Use global setting'
                  ? 'primary'
                  : undefined
              }
            >
              Use global setting
            </MenuItem>
          )}
        </Menu>
      </Box>
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
