import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { InternetStatusToastProps } from '@screens/MangaView/components/InternetStatusToast/InternetStatusToast.interfaces';

const mapStateToProps = (state: AppState, props: InternetStatusToastProps) => ({
  ...props,
  internetStatus: state.explore.internetStatus,
});

const connector = connect(mapStateToProps);

export type ConnectedInternetStatusProps = ConnectedProps<typeof connector>;

export default connector;
