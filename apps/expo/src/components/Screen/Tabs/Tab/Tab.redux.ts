import { TabProps } from '@components/Screen/Tabs/Tab/Tab.interfaces';
import { AppState } from '@redux/store';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState, props: TabProps) => ({
  ...props,
  deviceOrientation: state.settings.deviceOrientation,
});

const connector = connect(mapStateToProps);

export type ConnectedTabProps = ConnectedProps<typeof connector>;

export default connector;
