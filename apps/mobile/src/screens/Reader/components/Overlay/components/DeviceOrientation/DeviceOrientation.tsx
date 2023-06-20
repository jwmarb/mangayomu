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
import ModalMenu from '@components/ModalMenu/ModalMenu';
import { RectButton } from 'react-native-gesture-handler';
import { useTheme } from '@emotion/react';

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
  const theme = useTheme();
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
    <ModalMenu
      value={lockOrientation}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange={setLockOrientation as any}
      title="Device orientation"
      enum={{
        ...(mangaKey != null
          ? { 'Use global setting': 'Use global setting' }
          : {}),
        ...ReaderScreenOrientation,
      }}
      trigger={
        <RectButton rippleColor={theme.palette.action.ripple}>
          <Stack flex-direction="row" space="s" align-items="center">
            <Box align-self="center" ml="l">
              <Icon
                type="font"
                name="phone-rotate-landscape"
                variant="header"
              />
            </Box>
            <Box p="m">
              <Text>Device orientation</Text>
              <Text variant="body-sub" color="textSecondary">
                {lockOrientation}
              </Text>
            </Box>
          </Stack>
        </RectButton>
      }
    />
  );
};

export default connector(DeviceOrientation);
