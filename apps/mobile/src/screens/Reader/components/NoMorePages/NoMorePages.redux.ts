import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState) => ({
  backgroundColor: state.settings.reader.backgroundColor,
});

const connector = connect(mapStateToProps);

export type ConnectedNoMorePagesProps = ConnectedProps<typeof connector>;

export default connector;
