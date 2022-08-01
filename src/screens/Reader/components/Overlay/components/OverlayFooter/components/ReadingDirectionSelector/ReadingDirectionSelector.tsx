import { Icon, IconButton } from '@components/core';
import React from 'react';
import { SelectorProps } from '@screens/Reader/components/Overlay/components/OverlayFooter/components/Selector.interfaces';

const ReadingDirectionSelector: React.FC<SelectorProps> = (props) => {
  const { onOpen } = props;

  return <IconButton icon={<Icon bundle='MaterialCommunityIcons' name='book-open-variant' />} onPress={onOpen} />;
};

export default React.memo(ReadingDirectionSelector);
