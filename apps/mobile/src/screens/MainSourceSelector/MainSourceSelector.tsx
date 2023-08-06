import Box from '@components/Box';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import Item from '@screens/Welcome/components/MainSourceSelector/components/Item';
import { ListRenderItem } from 'react-native';

import { MangaHost } from '@mangayomu/mangascraper/src';
import { applyFilterState, setQuery } from '@redux/slices/mainSourceSelector';
import { SORT_HOSTS_BY } from '@redux/slices/host';
import Text from '@components/Text';
import useBoolean from '@hooks/useBoolean';
import Input from '@components/Input';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Stack from '@components/Stack';
import { MangaSourceSelectorFilters } from '@screens/Welcome/components/MainSourceSelector/components/Header/Header';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import Animated from 'react-native-reanimated';
import useAppSelector from '@hooks/useAppSelector';
import { useAppDispatch } from '@redux/main';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
const state = MangaHost.sources;

const MainSourceSelector: React.ForwardRefRenderFunction<
  BottomSheetMethods,
  RootStackProps<'MainSourceSelector'> & ReturnType<typeof useCollapsibleHeader>
> = (props, ref) => {
  const { scrollViewStyle, onScroll, contentContainerStyle } = props;
  const {
    query,
    sort,
    reversed,
    filters: { showNSFW, hasHotUpdates, hasLatestUpdates, hasMangaDirectory },
  } = useAppSelector((state) => state.mainSourceSelector);

  const [data, setData] = React.useState<string[]>(state);

  React.useEffect(() => {
    setData(
      state
        .filter((x) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const host = MangaHost.sourcesMap.get(x)!;
          return (
            x.trim().toLowerCase().includes(query.trim().toLowerCase()) &&
            applyFilterState(host.hasHotMangas(), hasHotUpdates) &&
            applyFilterState(host.hasLatestMangas(), hasLatestUpdates) &&
            applyFilterState(host.isAdult(), showNSFW) &&
            applyFilterState(host.hasMangaDirectory(), hasMangaDirectory)
          );
        })
        .sort(SORT_HOSTS_BY[sort](reversed)),
    );
  }, [
    query,
    showNSFW,
    hasHotUpdates,
    hasLatestUpdates,
    hasMangaDirectory,
    sort,
    reversed,
  ]);

  return (
    <>
      <MangaSourceSelectorFilters ref={ref} />
      <Animated.FlatList
        ListHeaderComponent={<Box style={scrollViewStyle} />}
        ListFooterComponent={<Box style={contentContainerStyle} />}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onScroll={onScroll}
      />
    </>
  );
};

const renderItem: ListRenderItem<string> = ({ item }) => <Item item={item} />;
const keyExtractor = (item: string, i: number) => item + i;

export default React.forwardRef(MainSourceSelector);
