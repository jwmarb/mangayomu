import { Icon, IconButton } from '@components/core';
import React from 'react';
import { SelectorProps } from '@screens/Reader/components/Overlay/components/OverlayFooter/components/Selector.interfaces';

const ImageScalingSelector: React.FC<SelectorProps> = (props) => {
  const { onOpen } = props;

  return <IconButton icon={<Icon bundle='MaterialCommunityIcons' name='image' />} onPress={onOpen} />;
};

export default React.memo(ImageScalingSelector);
