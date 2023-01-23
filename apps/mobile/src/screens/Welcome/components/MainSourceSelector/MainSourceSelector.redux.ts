import { connect, ConnectedProps } from 'react-redux';
import { changeSource } from '@redux/slices/host';
import { AppState } from '@redux/main';

const mapStateToProps = (state: AppState, props: { item: string }) => ({
  isSelected: props.item === state.host.name,
  item: props.item,
});

const connector = connect(mapStateToProps, { changeSource });

export type ConnectedItemProps = ConnectedProps<typeof connector>;

export default connector;
