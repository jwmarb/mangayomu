import Badge from '@components/Badge/Badge';
import { IconButton, Icon } from '@components/core';
import { Header } from '@components/Screen';
import { RootStackParamList } from '@navigators/Root/Root.interfaces';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { Animated } from 'react-native';
import { useCollapsibleHeader, UseCollapsibleOptions } from 'react-navigation-collapsible';
import DownloadManagerHeader from './components/DownloadManagerHeader';

const DownloadManager: React.FC<StackScreenProps<RootStackParamList, 'DownloadManager'>> = (props) => {
  const { navigation } = props;
  function handleOnPress() {
    navigation.navigate('Settings');
  }
  const options: UseCollapsibleOptions = {
    navigationOptions: {
      header: Header,
      headerTitle: '',
      headerRight: () => (
        <>
          <IconButton icon={<Icon bundle='Feather' name='settings' />} onPress={handleOnPress} />
          <Badge>
            <IconButton icon={<Icon bundle='Feather' name='filter' />} onPress={handleOnPress} />
          </Badge>
        </>
      ),
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
      ListHeaderComponent={DownloadManagerHeader}
    />
  );
};

export default DownloadManager;
