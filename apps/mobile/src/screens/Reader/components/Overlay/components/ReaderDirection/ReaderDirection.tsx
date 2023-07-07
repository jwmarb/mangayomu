import React from 'react';
import connector, {
  ConnectedReaderDirectionProps,
} from './ReaderDirection.redux';
import { Menu, MenuItem } from '@components/Menu';
import Icon from '@components/Icon';
import { ReadingDirection, useReaderSetting } from '@redux/slices/settings';
import Stack from '@components/Stack';
import Text from '@components/Text';
import OverlayBottomButton from '@screens/Reader/components/Overlay/components/OverlayBottomButton';
import Box from '@components/Box/Box';
import { useMangaKey } from '@screens/Reader/context/MangaKey';
import ModalMenu from '@components/ModalMenu';
import { useTheme } from '@emotion/react';
import { Pressable } from 'react-native';

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
  const theme = useTheme();

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
    <ModalMenu
      value={readingDirection}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange={setReadingDirection as any}
      title="Reading direction"
      enum={{
        ...(mangaKey != null
          ? { 'Use global setting': 'Use global setting' }
          : {}),
        ...ReadingDirection,
      }}
      trigger={
        <Pressable android_ripple={{ color: theme.palette.action.ripple }}>
          <Stack flex-direction="row" space="s" align-items="center">
            <Box align-self="center" ml="l">
              <Icon type="font" name="book-open" variant="header" />
            </Box>
            <Box p="m">
              <Text>Reading direction</Text>
              <Text variant="body-sub" color="textSecondary">
                {readingDirection}
              </Text>
            </Box>
          </Stack>
        </Pressable>
      }
    />
  );
};

export default connector(React.memo(ReaderDirection));
