import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { toggleCloudSync } from '@redux/slices/settings';

const mapStateToProps = (state: AppState) => ({
  cloudSyncEnabled: state.settings.cloud.enabled,
});

const connector = connect(mapStateToProps, { toggleCloudSync });

export type ConnectedCloudSwitchProps = ConnectedProps<typeof connector>;

export default connector;
