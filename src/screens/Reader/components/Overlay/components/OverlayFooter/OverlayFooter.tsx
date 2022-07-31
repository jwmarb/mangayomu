import React from 'react';
import { OverlayFooterProps } from './OverlayFooter.interfaces';
import { OverlayFooterContainer } from './OverlayFooter.base';
import generateMenu from '@utils/generateMenu';
import {
  OverloadedSetting,
  ReaderScreenOrientation,
} from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.constants';
import { Icon, Flex, IconButton } from '@components/core';
import ScreenOrientationSelector from '@screens/Reader/components/Overlay/components/ScreenOrientationSelector/ScreenOrientationSelector';
const OverlayFooter: React.FC<OverlayFooterProps> = (props) => {
  const { manga, orientation, setOrientationForSeries } = props;

  const [Menu, onOpen] = generateMenu({ ...OverloadedSetting, ...ReaderScreenOrientation }, orientation, {
    onSelect: (selected) => setOrientationForSeries(manga.link, selected),
    icons: {
      AUTO: <Icon bundle='MaterialCommunityIcons' name='earth' />,
      FREE: <Icon bundle='MaterialCommunityIcons' name='screen-rotation' />,
      LANDSCAPE: <Icon bundle='MaterialCommunityIcons' name='phone-rotate-landscape' />,
      PORTRAIT: <Icon bundle='MaterialCommunityIcons' name='phone-rotate-portrait' />,
    },
  });

  return (
    <OverlayFooterContainer>
      <Menu>
        <ScreenOrientationSelector manga={manga} onOpen={onOpen} />
      </Menu>

      <Flex>
        <IconButton icon={<Icon bundle='Feather' name='chevron-left' />} />
        <IconButton icon={<Icon bundle='Feather' name='chevron-right' />} />
      </Flex>
    </OverlayFooterContainer>
  );
};

export default React.memo(OverlayFooter);
