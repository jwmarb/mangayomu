import React from 'react';
import Global from '@screens/Reader/components/ReaderSettingsMenu/components/GlobalReaderSettings/GlobalReaderSettings';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import Animated from 'react-native-reanimated';

const GlobalReaderSettings: React.FC<
  ReturnType<typeof useCollapsibleHeader>
> = ({ onScroll, contentContainerStyle, scrollViewStyle }) => {
  return (
    <Animated.ScrollView
      contentContainerStyle={[contentContainerStyle, scrollViewStyle]}
      onScroll={onScroll}
    >
      <Global />
    </Animated.ScrollView>
  );
};

export default GlobalReaderSettings;
