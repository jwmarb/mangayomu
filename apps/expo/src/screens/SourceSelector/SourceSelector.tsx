import { RootStackParamList } from '@navigators/Root/Root.interfaces';
import { StackScreenProps } from '@react-navigation/stack';
import SourceSelectorHeader from '@screens/SourceSelector/components/SourceSelectorHeader';
import React from 'react';
import { Animated } from 'react-native';
import { useCollapsibleHeader, UseCollapsibleOptions } from 'react-navigation-collapsible';
import { renderItem, keyExtractor } from './SourceSelector.flatlist';
import { Header } from '@components/core';
import MangaHost from '@services/scraper/scraper.abstract';
import useMangaSource from '@hooks/useMangaSource';
import { MangaSourceProps } from '@screens/SourceSelector/components/MangaSource/MangaSource.interfaces';
const SourceSelector: React.FC<StackScreenProps<RootStackParamList, 'SourceSelector'>> = (props) => {
  const { navigation } = props;
  const source = useMangaSource();
  const options: UseCollapsibleOptions = {
    navigationOptions: {
      header: Header,
      headerTitle: 'Change Source',
    },
    config: {
      useNativeDriver: true,
    },
  };

  const data = React.useMemo(() => {
    const arr: MangaSourceProps[] = [];
    for (const x of MangaHost.availableSources.values()) {
      arr.push({ source: x, isCurrentSource: x === source });
    }
    return arr;
  }, [source]);

  const { containerPaddingTop, scrollIndicatorInsetTop, onScroll } = useCollapsibleHeader(options);
  return (
    <Animated.FlatList
      contentContainerStyle={{ paddingTop: containerPaddingTop }}
      scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
      onScroll={onScroll}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={SourceSelectorHeader}
    />
  );
};

export default SourceSelector;
