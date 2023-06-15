import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { setNetworkState } from '@redux/slices/explore';
import { NetworkToastProps } from '@screens/Reader/components/NetworkToast/NetworkToast.interfaces';

const mapStateToProps = (state: AppState, props: NetworkToastProps) => ({
  ...props,
  internetStatus: state.explore.internetStatus,
});

const connector = connect(mapStateToProps, { setNetworkState });

export type ConnectedNetworkToastProps = ConnectedProps<typeof connector>;

export default connector;
