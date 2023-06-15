import Button from '@components/Button';
import Icon from '@components/Icon';
import { Menu, MenuItem } from '@components/Menu';
import Stack from '@components/Stack';
import Text from '@components/Text';
import {
  ReaderScreenOrientation,
  useReaderSetting,
} from '@redux/slices/settings';
import React from 'react';
import connector, {
  ConnectedDeviceOrientationProps,
} from './DeviceOrientation.redux';
import Box from '@components/Box/Box';
import OverlayBottomButton from '@screens/Reader/components/Overlay/components/OverlayBottomButton/OverlayBottomButton';
import { useMangaKey } from '@screens/Reader/context/MangaKey';

const DeviceOrientation: React.FC<ConnectedDeviceOrientationProps> = (
  props,
) => {
  const {
    lockOrientation: globalLockOrientation,
    type = 'button',
    setLockedDeviceOrientation,
  } = props;
  const mangaKey = useMangaKey();
  const set = React.useCallback(
    (val: ReaderScreenOrientation | 'Use global setting') => {
      if (val !== 'Use global setting') setLockedDeviceOrientation(val);
    },
    [setLockedDeviceOrientation],
  );
  const [lockOrientation, setLockOrientation] = useReaderSetting(
    'readerLockOrientation',
    globalLockOrientation,
    mangaKey ?? set,
  );
  if (type === 'button')
    return (
      <Box flex-grow>
        <Menu
          trigger={
            <OverlayBottomButton
              name="phone-rotate-portrait"
              settingName="Device orientation"
            />
          }
        >
          {Object.entries(ReaderScreenOrientation).map(([key, value]) => (
            <MenuItem
              key={key}
              optionKey={value as ReaderScreenOrientation}
              onSelect={setLockOrientation}
              color={value === lockOrientation ? 'primary' : undefined}
            >
              {value}
            </MenuItem>
          ))}
          {mangaKey != null && (
            <MenuItem
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              optionKey={'Use global setting' as any}
              onSelect={setLockOrientation}
              color={
                lockOrientation === 'Use global setting' ? 'primary' : undefined
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
      space="s"
      justify-content="space-between"
      align-items="center"
      flex-direction="row"
    >
      <Text>Device orientation</Text>
      <Menu
        trigger={
          <Button
            label={lockOrientation}
            icon={<Icon type="font" name="chevron-down" />}
            iconPlacement="right"
          />
        }
      >
        {Object.entries(ReaderScreenOrientation).map(([key, value]) => (
          <MenuItem
            key={key}
            optionKey={value as ReaderScreenOrientation}
            onSelect={setLockOrientation}
            color={value === lockOrientation ? 'primary' : undefined}
          >
            {value}
          </MenuItem>
        ))}
        {mangaKey != null && (
          <MenuItem
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            optionKey={'Use global setting' as any}
            onSelect={setLockOrientation}
            color={
              lockOrientation === 'Use global setting' ? 'primary' : undefined
            }
          >
            Use global setting
          </MenuItem>
        )}
      </Menu>
    </Stack>
  );
};

export default connector(DeviceOrientation);
