import { Header } from '@components/Screen';
import React from 'react';
import { Animated } from 'react-native';
import { useCollapsibleHeader, UseCollapsibleOptions } from 'react-navigation-collapsible';

const DownloadManager: React.FC = (props) => {
  const {} = props;
  const options: UseCollapsibleOptions = {
    navigationOptions: {
      header: Header,
      headerTitle: 'Download Manager',
    },
    config: {
      useNativeDriver: true,
    },
  };
  const { onScroll, containerPaddingTop, scrollIndicatorInsetTop } = useCollapsibleHeader(options);

  return (
    <Animated.FlatList
      data={[]}
      renderItem={null}
      onScroll={onScroll}
      contentContainerStyle={{ paddingTop: containerPaddingTop }}
      scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
    />
  );
};

export default DownloadManager;
