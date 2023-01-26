import { connect, ConnectedProps } from 'react-redux';
import {
  addSource,
  addSources,
  removeSource,
  removeSources,
} from '@redux/slices/host';
import { AppState } from '@redux/main';

const mapStateToProps = (state: AppState, props: { item: string }) => ({
  isSelected: state.host.name.has(props.item),
  item: props.item,
});

const connector = connect(mapStateToProps, {
  addSource,
  addSources,
  removeSource,
  removeSources,
});

export type ConnectedItemProps = ConnectedProps<typeof connector>;

export default connector;
