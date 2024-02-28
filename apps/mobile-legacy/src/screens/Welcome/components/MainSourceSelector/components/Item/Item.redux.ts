import { connect, ConnectedProps } from 'react-redux';
import { addSource, removeSource, SORT_HOSTS_BY } from '@redux/slices/host';
import { AppState } from '@redux/main';
import integrateSortedList from '@helpers/integrateSortedList';

const mapStateToProps = (state: AppState, props: { item: string }) => ({
  isSelected:
    integrateSortedList(
      state.host.name,
      SORT_HOSTS_BY[state.host.comparatorKey](state.host.reversed),
    ).indexOf(props.item) !== -1,
  item: props.item,
});

const connector = connect(mapStateToProps, {
  addSource,
  removeSource,
});

export type ConnectedItemProps = ConnectedProps<typeof connector>;

export default connector;
