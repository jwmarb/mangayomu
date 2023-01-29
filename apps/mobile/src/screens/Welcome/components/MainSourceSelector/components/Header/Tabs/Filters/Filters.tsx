import MultiCheckbox from '@components/MultiCheckbox';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { AppState } from '@redux/main';
import {
  MainSourceFilterKeys,
  switchStateOfFilter,
} from '@redux/slices/mainSourceSelector';
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

const _Item: React.FC<ConnectedItemProps> = (props) => {
  return (
    <RectButton onPress={props.toggle}>
      <Stack space="s" m="s" flex-direction="row" align-items="center">
        <MultiCheckbox state={props.state} onChange={props.toggle} />
        <Text color="textSecondary">{props.title}</Text>
      </Stack>
    </RectButton>
  );
};

const itemConnector = connect(mapStateToProps, (dispatch, props) => ({
  toggle: () => dispatch(switchStateOfFilter(props.itemKey)),
}));

type ConnectedItemProps = ConnectedProps<typeof itemConnector>;

const Item = itemConnector(React.memo(_Item));

export default Filters;
