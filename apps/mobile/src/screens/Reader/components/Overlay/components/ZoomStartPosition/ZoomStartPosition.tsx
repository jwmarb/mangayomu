import { useReaderContext } from '@screens/Reader/Reader';
import React from 'react';
import connector, {
  ConnectedZoomStartPositionProps,
} from './ZoomStartPosition.redux';
import { Menu, MenuItem } from '@components/Menu';
import IconButton from '@components/IconButton';
import Icon from '@components/Icon';
import {
  ZoomStartPosition as EnumZoomStartPosition,
  useReaderSetting,
} from '@redux/slices/settings';
import { OVERLAY_TEXT_SECONDARY } from '@screens/Reader/components/Overlay/Overlay';

const ZoomStartPosition: React.FC<ConnectedZoomStartPositionProps> = (
  props,
) => {
  const { globalZoomStartPosition } = props;
  const { mangaKey } = useReaderContext();
  const [zoomStartPosition, setZoomStartPosition] = useReaderSetting(
    'readerZoomStartPosition',
    globalZoomStartPosition,
    mangaKey,
  );

  return (
    <Menu
      trigger={
        <IconButton
          icon={<Icon type="font" name="book-open-variant" />}
          color={OVERLAY_TEXT_SECONDARY}
        />
      }
    >
      {Object.entries(EnumZoomStartPosition).map(([key, value]) => (
        <MenuItem
          key={key}
          optionKey={value as EnumZoomStartPosition}
          onSelect={setZoomStartPosition}
          color={value === zoomStartPosition ? 'primary' : undefined}
        >
          {value}
        </MenuItem>
      ))}
      <MenuItem
        optionKey="Use global setting"
        onSelect={setZoomStartPosition}
        color={
          zoomStartPosition === 'Use global setting' ? 'primary' : undefined
        }
      >
        Use global setting
      </MenuItem>
    </Menu>
  );
};

export default connector(React.memo(ZoomStartPosition));
