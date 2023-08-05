import { CustomBottomSheet } from '@components/CustomBottomSheet';
import { useTheme } from '@emotion/react';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import useAppSelector from '@hooks/useAppSelector';
import { MangaHost } from '@mangayomu/mangascraper/src';
import { useAppDispatch } from '@redux/main';
import {
  enableRerendering,
  SORT_HOSTS_BY,
  suspendRendering,
} from '@redux/slices/host';
import { applyFilterState } from '@redux/slices/mainSourceSelector';
import Header from '@screens/Welcome/components/MainSourceSelector/components/Header';
import Item from '@screens/Welcome/components/MainSourceSelector/components/Item';
import React from 'react';
import { ListRenderItem } from 'react-native';

const state = MangaHost.sources;

const MainSourceSelector = React.forwardRef<BottomSheetMethods>((_, ref) => {
  const {
    query,
    sort,
    reversed,
    filters: { showNSFW, hasHotUpdates, hasLatestUpdates, hasMangaDirectory },
  } = useAppSelector((state) => state.mainSourceSelector);
  const dispatch = useAppDispatch();
  const [data, setData] = React.useState<string[]>(state);
  const theme = useTheme();
  const contentContainerStyle = React.useMemo(
    () => [{ backgroundColor: theme.palette.background.default }],
    [theme.palette.background.default],
  );
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
    <CustomBottomSheet
      onOpen={() => dispatch(suspendRendering())}
      onClose={() => dispatch(enableRerendering())}
      header={<Header />}
      ref={ref}
    >
      <BottomSheetFlatList
        contentContainerStyle={contentContainerStyle}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </CustomBottomSheet>
  );
});

const keyExtractor = (k: string, i: number) => k + i;
const renderItem: ListRenderItem<string> = ({ item }) => {
  return <Item item={item} />;
};

export default MainSourceSelector;
