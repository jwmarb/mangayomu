import { Button, Checkbox, Divider, Icon, List, ListItem, ListSection, Switch } from '@components/core';
import {
  ImageScaling,
  ReaderScreenOrientation,
  ZoomStartPosition,
} from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.constants';
import { ReaderBackgroundColor, ReaderDirection } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import ItemDropdown from '@screens/Settings/screens/components/ItemDropdown';
import { ItemDropdownMenu } from '@screens/Settings/screens/components/ItemDropdown/ItemDropdown.interfaces';
import ItemToggle from '@screens/Settings/screens/components/ItemToggle';

import connector, { ConnectedReaderSettingsScreenProps } from '@screens/Settings/screens/Reader/Reader.redux';
import React from 'react';
import { HoldItem } from 'react-native-hold-menu';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';

const Reader: React.FC<ConnectedReaderSettingsScreenProps> = (props) => {
  const {
    settings,
    changeReaderBackground,
    changeReaderDirection,
    toggleSkipChaptersMarkedRead,
    toggleKeepDeviceAwake,
    setReaderScreenOrientation,
    setReaderScreenImageScaling,
    toggleShowPageNumber,
    setReaderScreenZoomStartPosition,
  } = props;
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
  const readerDirectionOptions: ItemDropdownMenu[] = React.useMemo(
    () =>
      Object.values(ReaderDirection).map(
        (x): ItemDropdownMenu => ({
          text: x,
          isSelected: settings._global.readingDirection === x,
          onPress: () => {
            changeReaderDirection(x);
          },
        })
      ),
    [settings._global.readingDirection]
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
    <>
      <ListSection title='Reader' />
      <ItemDropdown
        title='Reading direction'
        subtitle={settings._global.readingDirection}
        items={readerDirectionOptions}
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
      <Divider />
      <ListSection title='General' />
      <ItemDropdown title='Background color' subtitle={settings.backgroundColor} items={bgColorOptions} />
      <ItemToggle title='Keep device awake' enabled={settings.keepDeviceAwake} onChange={toggleKeepDeviceAwake} />
      <ItemToggle title='Show page number' enabled={settings.showPageNumber} onChange={toggleShowPageNumber} />
      <ItemToggle
        title='Skip chapters marked read'
        enabled={settings.skipChaptersMarkedRead}
        onChange={toggleSkipChaptersMarkedRead}
      />
    </>
  );
};

export default connector(Reader);
