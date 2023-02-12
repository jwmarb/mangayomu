import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { AppState } from '@redux/main';
import { SORT_HOSTS_BY } from '@redux/slices/host';
import { setSort, toggleReverse } from '@redux/slices/mainSourceSelector';
import React from 'react';
import { ListRenderItem } from 'react-native';
import SortItem from './Sort.item';

import { connect, ConnectedProps } from 'react-redux';

const data = Object.keys(SORT_HOSTS_BY) as (keyof typeof SORT_HOSTS_BY)[];
const renderItem: ListRenderItem<keyof typeof SORT_HOSTS_BY> = ({ item }) => (
  <Item title={item} />
);
const keyExtractor = (item: string) => item;

const Sort: React.FC = () => {
  return (
    <BottomSheetFlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
};

const _Item: React.FC<ConnectedItemProps> = (props) => {
  return (
    <SortItem
      onChange={props.setSort}
      onToggleReverse={props.toggleReverse}
      reversed={props.reversed}
      isSelected={props.isSelected}
      title={props.title}
    />
  );
};

const mapStateToProps = (
  state: AppState,
  props: { title: keyof typeof SORT_HOSTS_BY },
) => ({
  reversed: state.mainSourceSelector.reversed,
  isSelected: state.mainSourceSelector.sort === props.title,
  title: props.title,
});

const itemConnector = connect(mapStateToProps, { setSort, toggleReverse });

type ConnectedItemProps = ConnectedProps<typeof itemConnector>;

const Item = itemConnector(_Item);

export default Sort;
