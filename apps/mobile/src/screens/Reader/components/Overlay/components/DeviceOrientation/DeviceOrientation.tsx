import Button from '@components/Button';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import { Menu, MenuItem } from '@components/Menu';
import Stack from '@components/Stack';
import Text from '@components/Text';
import {
  ReaderScreenOrientation,
  useReaderSetting,
} from '@redux/slices/settings';
import { useReaderContext } from '@screens/Reader/Reader';
import React from 'react';
import connector, {
  ConnectedDeviceOrientationProps,
} from './DeviceOrientation.redux';
import { OVERLAY_TEXT_SECONDARY } from '@theme/constants';

const DeviceOrientation: React.FC<ConnectedDeviceOrientationProps> = (
  props,
) => {
  const {
    lockOrientation: globalLockOrientation,
    type = 'button',
    setLockedDeviceOrientation,
  } = props;
  const mangaKey = useReaderContext();
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
      <Menu
        trigger={
          <IconButton
            icon={<Icon type="font" name="phone-rotate-portrait" />}
            color={OVERLAY_TEXT_SECONDARY}
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
