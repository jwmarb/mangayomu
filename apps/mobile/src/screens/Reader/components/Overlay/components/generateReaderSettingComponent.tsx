/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from '@components/Box';
import Icon, { IconProps } from '@components/Icon';
import { Menu, MenuItem } from '@components/Menu';
import ModalMenu from '@components/ModalMenu';
import Pressable from '@components/Pressable';
import Stack from '@components/Stack';
import Text from '@components/Text';
import useAppSelector from '@hooks/useAppSelector';
import {
  ImageScaling,
  ReaderScreenOrientation,
  ReadingDirection,
  ZoomStartPosition,
} from '@mangayomu/schemas';
import { AppState, useAppDispatch } from '@redux/main';
import { useReaderSetting } from '@redux/slices/settings';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { ReaderSettingProps } from '@screens/Reader/components/Overlay';
import OverlayBottomButton from '@screens/Reader/components/Overlay/components/OverlayBottomButton';
import { useMangaKey } from '@screens/Reader/context/MangaKey';
import React from 'react';

type ReaderSetting<State = AppState['settings']['reader']> = keyof {
  [K in keyof State as State[K] extends
    | ReadingDirection
    | ZoomStartPosition
    | ImageScaling
    | ReaderScreenOrientation
    ? K
    : never]: never;
};

export default function generateReaderSettingComponent<T>(
  mangaReaderSetting: Parameters<typeof useReaderSetting>[0],
  setting: ReaderSetting,
  action: ActionCreatorWithPayload<T>,
  staticEnum: Record<PropertyKey, T>,
  modalMenuText = 'VALUE REQUIRED',
  modalMenuIcon: IconProps['name'] = 'exclamation-thick',
): React.FC<ReaderSettingProps> {
  return (props) => {
    const { type = 'button' } = props;

    const globalZoomStartPosition = useAppSelector(
      (state) => state.settings.reader[setting],
    );
    const dispatch = useAppDispatch();
    const mangaKey = useMangaKey();
    const set = React.useCallback(
      (val: T | 'Use global setting') => {
        if (val !== 'Use global setting') dispatch(action(val));
      },
      [dispatch, action],
    );
    const [value, setValue] = useReaderSetting<typeof mangaReaderSetting, any>(
      mangaReaderSetting,
      globalZoomStartPosition,
      mangaKey ?? set,
    );

    if (type === 'button')
      return (
        <Box flex-grow>
          <Menu
            trigger={
              <OverlayBottomButton
                name={modalMenuIcon}
                settingName={modalMenuText}
              />
            }
          >
            {Object.entries(staticEnum).map(([key, enumValue]) => (
              <MenuItem
                key={key}
                optionKey={enumValue as any}
                onSelect={setValue}
                color={value === enumValue ? 'primary' : undefined}
              >
                {enumValue as any}
              </MenuItem>
            ))}
            {mangaKey != null && (
              <MenuItem
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                optionKey={'Use global setting' as any}
                onSelect={setValue}
                color={value === 'Use global setting' ? 'primary' : undefined}
              >
                Use global setting
              </MenuItem>
            )}
          </Menu>
        </Box>
      );
    return (
      <ModalMenu
        value={value}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={setValue as any}
        title={modalMenuText}
        enum={{
          ...(mangaKey != null
            ? { 'Use global setting': 'Use global setting' }
            : {}),
          ...staticEnum,
        }}
        trigger={
          <Pressable>
            <Stack flex-direction="row" space="s" align-items="center">
              <Box align-self="center" ml="l">
                <Icon type="font" name={modalMenuIcon} variant="header" />
              </Box>
              <Box p="m">
                <Text>{modalMenuText}</Text>
                <Text variant="body-sub" color="textSecondary">
                  {value as any}
                </Text>
              </Box>
            </Stack>
          </Pressable>
        }
      />
    );
  };
}
