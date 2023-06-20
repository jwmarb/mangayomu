import React from 'react';
import Global from '@screens/Reader/components/ReaderSettingsMenu/components/GlobalReaderSettings/GlobalReaderSettings';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import Animated from 'react-native-reanimated';

const GlobalReaderSettings: React.FC = () => {
  const { onScroll, scrollViewStyle, contentContainerStyle } =
    useCollapsibleHeader({ headerTitle: 'Reader' });
  return (
    <Animated.ScrollView
      style={scrollViewStyle}
      contentContainerStyle={contentContainerStyle}
      onScroll={onScroll}
    >
      <Global />
    </Animated.ScrollView>
  );
};

export default GlobalReaderSettings;
