import { SelectorProps } from '@screens/Reader/components/Overlay/components/OverlayFooter/components/Selector.interfaces';
import { Icon, IconButton } from '@components/core';
import React from 'react';

const ZoomStartPositionSelector: React.FC<SelectorProps> = (props) => {
  const { onOpen } = props;

  return <IconButton icon={<Icon bundle='MaterialCommunityIcons' name='magnify-expand' />} onPress={onOpen} />;
};

export default React.memo(ZoomStartPositionSelector);
