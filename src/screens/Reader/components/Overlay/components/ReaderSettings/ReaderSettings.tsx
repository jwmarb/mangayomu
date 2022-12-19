import { List, ListItem, ListSection, Modal, Tab, Tabs } from '@components/core';
import React from 'react';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';
import connector, { ConnectedReaderSettingsProps } from './ReaderSettings.redux';
import { ReaderBackgroundColor, ReaderDirection } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import ItemDropdown from '@screens/Settings/screens/components/ItemDropdown';
import ItemToggle from '@screens/Settings/screens/components/ItemToggle';
import {
  ImageScaling,
  OverloadedSetting,
  ReaderScreenOrientation,
  ZoomStartPosition,
} from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.constants';
import { ItemDropdownMenu } from '@screens/Settings/screens/components/ItemDropdown/ItemDropdown.interfaces';
import { ToggleReaderSettingProfileKeys } from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.interfaces';

const ReaderSettings: React.FC<ConnectedReaderSettingsProps> = (props) => {
  const {
    visible,
    onClose,
    manga,
    settings,
    settingsForCurrentSeries,
    changeReaderBackground,
    changeReaderDirection,
    toggleSkipChaptersMarkedRead,
    toggleKeepDeviceAwake,
    toggleShowPageNumber,
    setReaderDirectionForSeries: _setReaderDirectionForSeries,
    setOrientationForSeries: _setOrientationForSeries,
    setReaderScreenOrientation,
    setReaderScreenImageScaling,
    setReaderScreenZoomStartPosition,
    setImageScalingForSeries: _setImageScalingForSeries,
    toggleNotifyLastChapter,
    toggleReaderSetting,
    toggleGlobalReaderSettingProfile: _toggleGlobalReaderSettingProfile,
    setZoomStartPositionForSeries: _setZoomStartPositionForSeries,
  } = props;

  const toggleReaderSettingForSeries = React.useCallback(
    (key: ToggleReaderSettingProfileKeys, value?: boolean | OverloadedSetting) => {
      toggleReaderSetting(manga.link, key, value);
    },
    [manga]
  );

  const setZoomStartPositionForSeries = React.useCallback(
    (zoomStartPosition: ZoomStartPosition | OverloadedSetting) => {
      _setZoomStartPositionForSeries(manga.link, zoomStartPosition);
    },
    [manga]
  );

  const setImageScalingForSeries = React.useCallback(
    (imageScaling: ImageScaling | OverloadedSetting) => {
      _setImageScalingForSeries(manga.link, imageScaling);
    },
    [manga]
  );

  const setReaderDirectionForSeries = React.useCallback(
    (direction: ReaderDirection | OverloadedSetting) => {
      _setReaderDirectionForSeries(manga.link, direction);
    },
    [manga]
  );
  const setOrientationForSeries = React.useCallback(
    (orientation: ReaderScreenOrientation | OverloadedSetting) => {
      _setOrientationForSeries(manga.link, orientation);
    },
    [manga]
  );

  const toggleGlobalReaderSettingProfile = React.useCallback(() => {
    _toggleGlobalReaderSettingProfile('shortChapters');
  }, [_toggleGlobalReaderSettingProfile]);
  const [index, setIndex] = React.useState<number>(0);

  const readerShortChaptersOptions: ItemDropdownMenu[] = React.useMemo(
    () => [
      {
        text: OverloadedSetting.AUTO,
        isSelected: settingsForCurrentSeries.shortChapters === OverloadedSetting.AUTO,
        onPress: () => {
          toggleReaderSettingForSeries('shortChapters', OverloadedSetting.AUTO);
        },
      },
      {
        text: 'Enabled',
        isSelected: settingsForCurrentSeries.shortChapters === true,
        onPress: () => {
          toggleReaderSettingForSeries('shortChapters', true);
        },
      },
      {
        text: 'Disabled',
        isSelected: settingsForCurrentSeries.shortChapters === false,
        onPress: () => {
          toggleReaderSettingForSeries('shortChapters', false);
        },
      },
    ],
    [settingsForCurrentSeries.shortChapters]
  );

  const readerZoomStartPositionOptions: ItemDropdownMenu[] = React.useMemo(
    () => [
      {
        text: OverloadedSetting.AUTO,
        isSelected: settingsForCurrentSeries.zoomStartPosition === OverloadedSetting.AUTO,
        onPress: () => {
          setZoomStartPositionForSeries(OverloadedSetting.AUTO);
        },
      },
      ...Object.values(ZoomStartPosition).map(
        (x): ItemDropdownMenu => ({
          text: x,
          isSelected: x === settingsForCurrentSeries.zoomStartPosition,
          onPress: () => {
            setZoomStartPositionForSeries(x);
          },
        })
      ),
    ],
    [setZoomStartPositionForSeries, settingsForCurrentSeries.zoomStartPosition]
  );

  const readerImageScalingOptions: ItemDropdownMenu[] = React.useMemo(
    () => [
      {
        text: OverloadedSetting.AUTO,
        isSelected: settingsForCurrentSeries.imageScaling === OverloadedSetting.AUTO,
        onPress: () => {
          setImageScalingForSeries(OverloadedSetting.AUTO);
        },
      },
      ...Object.values(ImageScaling).map(
        (x): ItemDropdownMenu => ({
          text: x,
          isSelected: x === settingsForCurrentSeries.imageScaling,
          onPress: () => {
            setImageScalingForSeries(x);
          },
        })
      ),
    ],
    [setImageScalingForSeries, settingsForCurrentSeries.imageScaling]
  );

  const readerScreenOrientationOptions: ItemDropdownMenu[] = React.useMemo(
    () => [
      {
        text: OverloadedSetting.AUTO,
        isSelected: settingsForCurrentSeries.orientation === OverloadedSetting.AUTO,
        onPress: () => {
          setOrientationForSeries(OverloadedSetting.AUTO);
        },
      },
      ...Object.values(ReaderScreenOrientation).map(
        (x): ItemDropdownMenu => ({
          text: x,
          isSelected: x === settingsForCurrentSeries.orientation,
          onPress: () => {
            setOrientationForSeries(x);
          },
        })
      ),
    ],
    [settingsForCurrentSeries.orientation, setOrientationForSeries]
  );
  const globalScreenOrientationOptions: ItemDropdownMenu[] = React.useMemo(
    () =>
      Object.values(ReaderScreenOrientation).map(
        (x): ItemDropdownMenu => ({
          text: x,
          isSelected: x === settings._global.orientation,
          onPress: () => {
            setReaderScreenOrientation(x);
          },
        })
      ),
    [settings._global.orientation]
  );
  const bgColorOptions: ItemDropdownMenu[] = React.useMemo(
    () =>
      Object.values(ReaderBackgroundColor).map(
        (x): ItemDropdownMenu => ({
          text: x,
          isSelected: settings.backgroundColor === x,
          onPress: () => {
            changeReaderBackground(x);
          },
        })
      ),
    [settings.backgroundColor]
  );
  const readerGlobalDirectionOptions: ItemDropdownMenu[] = React.useMemo(
    () =>
      Object.values(ReaderDirection).map(
        (x): ItemDropdownMenu => ({
          text: x,
          isSelected: x === settings._global.readingDirection,
          onPress: () => {
            changeReaderDirection(x);
          },
        })
      ),
    [settings._global.readingDirection]
  );
  const readerDirectionOptions: ItemDropdownMenu[] = React.useMemo(
    () => [
      {
        text: OverloadedSetting.AUTO,
        isSelected: settingsForCurrentSeries.readingDirection === OverloadedSetting.AUTO,
        onPress: () => {
          setReaderDirectionForSeries(OverloadedSetting.AUTO);
        },
      },
      ...Object.values(ReaderDirection).map(
        (x): ItemDropdownMenu => ({
          text: x,
          isSelected: x === settingsForCurrentSeries.readingDirection,
          onPress: () => {
            setReaderDirectionForSeries(x);
          },
        })
      ),
    ],
    [setReaderDirectionForSeries, settingsForCurrentSeries.readingDirection]
  );

  const globalScreenImageScalingOptions: ItemDropdownMenu[] = React.useMemo(
    () =>
      Object.values(ImageScaling).map(
        (x): ItemDropdownMenu => ({
          text: x,
          isSelected: x === settings._global.imageScaling,
          onPress: () => {
            setReaderScreenImageScaling(x);
          },
        })
      ),
    [settings._global.imageScaling]
  );

  const globalScreenZoomStartPositionOptions: ItemDropdownMenu[] = React.useMemo(
    () =>
      Object.values(ZoomStartPosition).map(
        (x): ItemDropdownMenu => ({
          text: x,
          isSelected: x === settings._global.zoomStartPosition,
          onPress: () => {
            setReaderScreenZoomStartPosition(x);
          },
        })
      ),
    [settings._global.zoomStartPosition]
  );

  return (
    <Modal visible={visible} onClose={onClose}>
      <Tabs tabIndex={index} onTabChange={setIndex}>
        <Tab name='Reading mode'>
          <List>
            <ListSection title='For this series' />
            <ItemDropdown
              title='Reader direction'
              subtitle={settingsForCurrentSeries.readingDirection}
              items={readerDirectionOptions}
            />

            <ItemDropdown
              title='Screen orientation'
              subtitle={settingsForCurrentSeries.orientation}
              items={readerScreenOrientationOptions}
            />
            <ItemDropdown
              title='Image scaling'
              subtitle={settingsForCurrentSeries.imageScaling}
              items={readerImageScalingOptions}
            />
            <ItemDropdown
              title='Zoom start position'
              subtitle={settingsForCurrentSeries.zoomStartPosition}
              items={readerZoomStartPositionOptions}
            />
            <ItemDropdown
              title='Short Chapters Mode'
              subtitle={
                settingsForCurrentSeries.shortChapters === OverloadedSetting.AUTO
                  ? OverloadedSetting.AUTO
                  : settingsForCurrentSeries.shortChapters
                  ? 'Enabled'
                  : 'Disabled'
              }
              items={readerShortChaptersOptions}
            />
            <ListSection title='Global' />
            <ItemDropdown
              title='Reading direction'
              subtitle={settings._global.readingDirection}
              items={readerGlobalDirectionOptions}
            />
            <ItemDropdown
              title='Screen orientation'
              subtitle={settings._global.orientation}
              items={globalScreenOrientationOptions}
            />
            <ItemDropdown
              title='Image scaling'
              subtitle={settings._global.imageScaling}
              items={globalScreenImageScalingOptions}
            />
            <ItemDropdown
              title='Zoom start position'
              subtitle={settings._global.zoomStartPosition}
              items={globalScreenZoomStartPositionOptions}
            />
            <ItemToggle
              title='Short Chapters Mode'
              subtitle='Enabling this will increase data usage, however, it will provide a more comfortable reading experience with very short chapters'
              enabled={settings._global.shortChapters}
              onChange={toggleGlobalReaderSettingProfile}
            />
          </List>
        </Tab>
        <Tab name='General'>
          <List>
            <ListSection title='Reader settings' />
            <ItemDropdown title='Background color' subtitle={settings.backgroundColor} items={bgColorOptions} />
            <ItemToggle title='Keep device awake' enabled={settings.keepDeviceAwake} onChange={toggleKeepDeviceAwake} />
            <ItemToggle title='Show page number' enabled={settings.showPageNumber} onChange={toggleShowPageNumber} />
            <ItemToggle
              title='Notify when last chapter'
              enabled={settings.notifyLastChapter}
              onChange={toggleNotifyLastChapter}
            />
            <ItemToggle
              title='Skip chapters marked read'
              enabled={settings.skipChaptersMarkedRead}
              onChange={toggleSkipChaptersMarkedRead}
            />
          </List>
        </Tab>
      </Tabs>
    </Modal>
  );
};

export default connector(React.memo(ReaderSettings));
