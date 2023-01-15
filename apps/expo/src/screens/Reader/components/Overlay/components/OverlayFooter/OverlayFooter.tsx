import React from 'react';
import { OverlayFooterProps } from './OverlayFooter.interfaces';
import { OverlayFooterContainer } from './OverlayFooter.base';
import generateMenu from '@utils/generateMenu';
import {
  ImageScaling,
  OverloadedSetting,
  ReaderScreenOrientation,
  ZoomStartPosition,
} from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.constants';
import { Icon, Flex, IconButton, MenuOption } from '@components/core';
import ScreenOrientationSelector from '@screens/Reader/components/Overlay/components/OverlayFooter/components/ScreenOrientationSelector/ScreenOrientationSelector';
import connector, {
  ConnectedOverlayFooterProps,
} from '@screens/Reader/components/Overlay/components/OverlayFooter/OverlayFooter.redux';
import ImageScalingSelector from '@screens/Reader/components/Overlay/components/OverlayFooter/components/ImageScalingSelector';
import ZoomStartPositionSelector from '@screens/Reader/components/Overlay/components/OverlayFooter/components/ZoomStartPositionSelector';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { useTheme } from 'styled-components/native';
import { ReaderDirection } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import ReadingDirectionSelector from '@screens/Reader/components/Overlay/components/OverlayFooter/components/ReadingDirectionSelector';

const orientationOptions = { ...OverloadedSetting, ...ReaderScreenOrientation };
const imageScalingOptions = { ...OverloadedSetting, ...ImageScaling };
const zoomStartPositionOptions = {
  ...OverloadedSetting,
  ...ZoomStartPosition,
};
const readingDirectionOptions = { ...OverloadedSetting, ...ReaderDirection };

const OverlayFooter: React.FC<ConnectedOverlayFooterProps> = (props) => {
  const {
    manga,
    orientation,
    setOrientationForSeries,
    imageScaling,
    setImageScalingForSeries,
    zoomStartPosition,
    setZoomStartPositionForSeries,
    readingDirection,
    setReaderDirectionForSeries,
  } = props;

  const [ScreenOrientationMenu, onOpenScreenOrientationMenu] = generateMenu(orientationOptions, orientation, {
    onSelect: (selected) => setOrientationForSeries(manga.link, selected),
  });

  const [ImageScalingMenu, onOpenImageScalingMenu] = generateMenu(imageScalingOptions, imageScaling, {
    onSelect: (selected) => setImageScalingForSeries(manga.link, selected),
  });

  const [ZoomStartPositionMenu, onOpenZoomStartPositionMenu] = generateMenu(
    zoomStartPositionOptions,
    zoomStartPosition,
    {
      onSelect: (selected) => setZoomStartPositionForSeries(manga.link, selected),
    }
  );

  const [ReadingDirectionMenu, onOpenReadingDirectionMenu] = generateMenu(readingDirectionOptions, readingDirection, {
    onSelect: (selected) => setReaderDirectionForSeries(manga.link, selected),
  });

  return (
    <OverlayFooterContainer>
      <ScreenOrientationMenu>
        <ScreenOrientationSelector manga={manga} onOpen={onOpenScreenOrientationMenu} />
      </ScreenOrientationMenu>
      <ImageScalingMenu>
        <ImageScalingSelector manga={manga} onOpen={onOpenImageScalingMenu} />
      </ImageScalingMenu>
      <ZoomStartPositionMenu>
        <ZoomStartPositionSelector manga={manga} onOpen={onOpenZoomStartPositionMenu} />
      </ZoomStartPositionMenu>
      <ReadingDirectionMenu>
        <ReadingDirectionSelector manga={manga} onOpen={onOpenReadingDirectionMenu} />
      </ReadingDirectionMenu>
    </OverlayFooterContainer>
  );
};

export default connector(React.memo(OverlayFooter));
