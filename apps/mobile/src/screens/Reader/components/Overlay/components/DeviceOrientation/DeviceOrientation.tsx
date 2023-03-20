import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import { Menu, MenuItem } from '@components/Menu';
import {
  ReaderScreenOrientation,
  useReaderSetting,
} from '@redux/slices/settings';
import { OVERLAY_TEXT_SECONDARY } from '@screens/Reader/components/Overlay/Overlay';
import { useReaderContext } from '@screens/Reader/Reader';
import React from 'react';
import connector, {
  ConnectedDeviceOrientationProps,
} from './DeviceOrientation.redux';

const DeviceOrientation: React.FC<ConnectedDeviceOrientationProps> = (
  props,
) => {
  const { lockOrientation: globalLockOrientation } = props;
  const { mangaKey } = useReaderContext();
  const [lockOrientation, setLockOrientation] = useReaderSetting(
    'readerLockOrientation',
    globalLockOrientation,
    mangaKey,
  );
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
      <MenuItem
        optionKey="Use global setting"
        onSelect={setLockOrientation}
        color={lockOrientation === 'Use global setting' ? 'primary' : undefined}
      >
        Use global setting
      </MenuItem>
    </Menu>
  );
};

export default connector(DeviceOrientation);
