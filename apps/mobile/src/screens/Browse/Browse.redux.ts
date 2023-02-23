import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState) => ({
  sources: state.host.name,
  pinnedSources: Object.keys(state.host.pinned),
});

const connector = connect(mapStateToProps);

export type ConnectedBrowseProps = ConnectedProps<typeof connector>;

export default connector;
