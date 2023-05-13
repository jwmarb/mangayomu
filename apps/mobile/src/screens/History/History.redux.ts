import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { toggleIncognitoMode } from '@redux/slices/settings';

const mapStateToProps = (state: AppState) => ({
  incognito: state.settings.history.incognito,
});

const connector = connect(mapStateToProps, { toggleIncognitoMode });

export type ConnectedHistoryProps = ConnectedProps<typeof connector>;

export default connector;
