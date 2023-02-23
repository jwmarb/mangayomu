import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { toggleSourcePin } from '@redux/slices/host';
import type { ItemProps } from './Item.interfaces';

const mapStateToProps = (state: AppState, props: ItemProps) => ({
  item: props.item,
  isPinned: props.item in state.host.pinned,
});

const connector = connect(mapStateToProps, { toggleSourcePin });

export type ConnectedItemProps = ConnectedProps<typeof connector>;

export default connector;
