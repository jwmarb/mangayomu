import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { setNetworkState } from '@redux/slices/explore';

const mapStateToProps = (state: AppState) => ({
  internetStatus: state.explore.internetStatus,
});

const connector = connect(mapStateToProps, { setNetworkState });

export type ConnectedNetworkToastProps = ConnectedProps<typeof connector>;

export default connector;
