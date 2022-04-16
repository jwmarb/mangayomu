import { ScreenProps } from '@components/Screen/Screen.interfaces';
import { Screen as View, ScrollableScreen } from './Screen.base';
import React from 'react';

const Screen: React.FC<ScreenProps> = (props) => {
  const { scrollable = false, ...rest } = props;
  if (scrollable)
    return (
      <ScrollableScreen>
        <View {...rest} />
      </ScrollableScreen>
    );
  return <View {...rest} />;
};

export default Screen;
