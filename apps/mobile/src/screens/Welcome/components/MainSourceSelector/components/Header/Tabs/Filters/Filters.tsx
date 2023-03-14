import MultiCheckbox from '@components/MultiCheckbox';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { AppState } from '@redux/main';
import {
  FilterState,
  MainSourceFilterKeys,
  switchStateOfFilter,
} from '@redux/slices/mainSourceSelector';
import FilterItem from '@components/Filters/FilterItem';
import React from 'react';
import { ListRenderItem } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { connect, ConnectedProps } from 'react-redux';

const filters: { itemKey: MainSourceFilterKeys; name: string }[] = [
  { itemKey: 'hasHotUpdates', name: 'Hot updates' },
  { itemKey: 'hasLatestUpdates', name: 'Latest updates' },
  { itemKey: 'hasMangaDirectory', name: 'Manga directory' },
  { itemKey: 'showNSFW', name: 'Adult content (18+)' },
];

type Element<T extends readonly unknown[]> = T extends readonly (infer U)[]
  ? U
  : never;

const keyExtractor = (item: Element<typeof filters>) => item.itemKey;
const renderItem: ListRenderItem<Element<typeof filters>> = ({ item }) => (
  <Item {...item} />
);

const Filters: React.FC = () => {
  return (
    <BottomSheetFlatList
      data={filters}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
};

const mapStateToProps = (state: AppState, props: Element<typeof filters>) => ({
  state: state.mainSourceSelector.filters[props.itemKey],
  title: props.name,
  itemKey: props.itemKey,
});

const itemConnector = connect(mapStateToProps, {
  onToggle: switchStateOfFilter,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Item = itemConnector(FilterItem as any);

export default Filters;
