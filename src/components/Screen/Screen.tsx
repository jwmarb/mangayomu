import { ScreenProps } from '@components/Screen/Screen.interfaces';
import { Screen as View, ScrollableScreen as ScrollView } from './Screen.base';
import React from 'react';

const Screen: React.FC<ScreenProps> = (props) => {
  const { scrollable = false, ...rest } = props;
  if (scrollable) return <ScrollView {...rest} />;
  return <View {...rest} />;
};

export default Screen;
