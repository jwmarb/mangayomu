import Badge from '@components/Badge/Badge';
import { IconButton, Icon } from '@components/core';
import { Header } from '@components/Screen';
import { RootStackParamList } from '@navigators/Root/Root.interfaces';
import { StackScreenProps } from '@react-navigation/stack';
import { AppState } from '@redux/store';
import { renderItem } from '@screens/DownloadManager/DownloadManager.flatlist';
import connector, { DownloadManagerProps } from '@screens/DownloadManager/DownloadManager.redux';
import React from 'react';
import { Animated } from 'react-native';
import { useCollapsibleHeader, UseCollapsibleOptions } from 'react-navigation-collapsible';
import DownloadManagerEmpty from './components/DownloadManagerEmpty';

const DownloadManager: React.FC<DownloadManagerProps> = (props) => {
  const { navigation, cursors, extraState } = props;
  const cursorEntries = React.useMemo(() => Object.entries(cursors), [cursors]);
  React.useEffect(() => {
    console.log('changed');
  }, [cursors]);
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
          <IconButton icon={<Icon bundle='Feather' name='more-vertical' />} onPress={handleOnPress} />
        </>
      ),
    },
    config: {
      useNativeDriver: true,
    },
  };
  const { onScroll, containerPaddingTop, scrollIndicatorInsetTop } = useCollapsibleHeader(options);

  if (cursorEntries.length === 0) return <DownloadManagerEmpty />;

  return (
    <Animated.FlatList
      extraData={extraState}
      data={cursorEntries}
      renderItem={renderItem}
      onScroll={onScroll}
      contentContainerStyle={{ paddingTop: containerPaddingTop }}
      scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
    />
  );
};

export default connector(DownloadManager);
