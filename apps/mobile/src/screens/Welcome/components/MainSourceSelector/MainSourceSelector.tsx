import { CustomBottomSheet } from '@components/CustomBottomSheet';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { MangaHost } from '@mangayomu/mangascraper';
import Header from '@screens/Welcome/components/MainSourceSelector/components/Header';
import Item from '@screens/Welcome/components/MainSourceSelector/components/Item';

import React from 'react';
import { ListRenderItem } from 'react-native';
import { MainSourceSelectorProps } from './MainSourceSelector.interfaces';

const MainSourceSelector = React.forwardRef<
  BottomSheetMethods,
  MainSourceSelectorProps
>((props, ref) => {
  const [data, setData] = React.useState<string[]>(MangaHost.getListSources());
  const [query, setQuery] = React.useState<string>('');
  React.useEffect(() => {
    setData(
      MangaHost.getListSources().filter((x) =>
        x.trim().toLowerCase().includes(query.trim().toLowerCase()),
      ),
    );
  }, [query]);

  return (
    <CustomBottomSheet ref={ref}>
      <BottomSheetFlatList
        ListHeaderComponent={<Header setQuery={setQuery} />}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </CustomBottomSheet>
  );
});

const keyExtractor = (k: string) => k;
const renderItem: ListRenderItem<string> = ({ item }) => {
  return <Item item={item} />;
};

export default MainSourceSelector;
