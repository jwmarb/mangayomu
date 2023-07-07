import React from 'react';
import connector, {
  ConnectedZoomStartPositionProps,
} from './ZoomStartPosition.redux';
import { Menu, MenuItem } from '@components/Menu';
import Icon from '@components/Icon';
import {
  ZoomStartPosition as EnumZoomStartPosition,
  useReaderSetting,
} from '@redux/slices/settings';
import Stack from '@components/Stack';
import Text from '@components/Text';
import OverlayBottomButton from '@screens/Reader/components/Overlay/components/OverlayBottomButton';
import Box from '@components/Box/Box';
import { useMangaKey } from '@screens/Reader/context/MangaKey';
import ModalMenu from '@components/ModalMenu';
import { useTheme } from '@emotion/react';
import { Pressable } from 'react-native';

const ZoomStartPosition: React.FC<ConnectedZoomStartPositionProps> = (
  props,
) => {
  const {
    globalZoomStartPosition,
    type = 'button',
    setGlobalZoomStartPosition,
  } = props;
  const mangaKey = useMangaKey();
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

  const theme = useTheme();

  if (type === 'button')
    return (
      <Box flex-grow>
        <Menu
          trigger={
            <OverlayBottomButton
              name="magnify"
              settingName="Zoom start position"
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
                zoomStartPosition === 'Use global setting'
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
      value={zoomStartPosition}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange={setZoomStartPosition as any}
      title="Zoom start position"
      enum={{
        ...(mangaKey != null
          ? { 'Use global setting': 'Use global setting' }
          : {}),
        ...EnumZoomStartPosition,
      }}
      trigger={
        <Pressable android_ripple={{ color: theme.palette.action.ripple }}>
          <Stack flex-direction="row" space="s" align-items="center">
            <Box align-self="center" ml="l">
              <Icon type="font" name="magnify-scan" variant="header" />
            </Box>
            <Box p="m">
              <Text>Zoom start position</Text>
              <Text variant="body-sub" color="textSecondary">
                {zoomStartPosition}
              </Text>
            </Box>
          </Stack>
        </Pressable>
      }
    />
  );
};

export default connector(React.memo(ZoomStartPosition));
