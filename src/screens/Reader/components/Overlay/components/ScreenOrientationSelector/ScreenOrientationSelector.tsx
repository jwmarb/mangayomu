import React from 'react';
import connector, { ConnectedScreenOrientationSelectorProps } from './ScreenOrientationSelector.redux';
import { Icon, IconButton } from '@components/core';
import { ReaderScreenOrientation } from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.constants';
const ScreenOrientationSelector: React.FC<ConnectedScreenOrientationSelectorProps> = (props) => {
  const { onOpen, orientation } = props;

  const iconName = React.useMemo(() => {
    switch (orientation) {
      default:
      case ReaderScreenOrientation.FREE:
        return 'screen-rotation';
      case ReaderScreenOrientation.LANDSCAPE:
        return 'phone-rotate-landscape';
      case ReaderScreenOrientation.PORTRAIT:
        return 'phone-rotate-portrait';
    }
  }, [orientation]);

  return <IconButton icon={<Icon bundle='MaterialCommunityIcons' name={iconName} />} onPress={onOpen} />;
};

export default connector(React.memo(ScreenOrientationSelector));
