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
import { OVERLAY_TEXT_SECONDARY } from '@theme/constants';
import Stack from '@components/Stack';
import Text from '@components/Text';
import Button from '@components/Button';

const ZoomStartPosition: React.FC<ConnectedZoomStartPositionProps> = (
  props,
) => {
  const {
    globalZoomStartPosition,
    type = 'button',
    setGlobalZoomStartPosition,
  } = props;
  const { mangaKey } = useReaderContext();
  const set = React.useCallback(
    (val: EnumZoomStartPosition | 'Use global setting') => {
      if (val !== 'Use global setting') setGlobalZoomStartPosition(val);
    },
    [setGlobalZoomStartPosition],
  );
  const [zoomStartPosition, setZoomStartPosition] = useReaderSetting(
    'readerZoomStartPosition',
    globalZoomStartPosition,
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
        {mangaKey != null && (
          <MenuItem
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            optionKey={'Use global setting' as any}
            onSelect={setZoomStartPosition}
            color={
              zoomStartPosition === 'Use global setting' ? 'primary' : undefined
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
      justify-content="space-between"
      align-items="center"
      space="s"
    >
      <Text>Zoom start position</Text>
      <Menu
        trigger={
          <Button
            label={zoomStartPosition}
            icon={<Icon type="font" name="chevron-down" />}
            iconPlacement="right"
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
        {mangaKey != null && (
          <MenuItem
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            optionKey={'Use global setting' as any}
            onSelect={setZoomStartPosition}
            color={
              zoomStartPosition === 'Use global setting' ? 'primary' : undefined
            }
          >
            Use global setting
          </MenuItem>
        )}
      </Menu>
    </Stack>
  );
};

export default connector(React.memo(ZoomStartPosition));
