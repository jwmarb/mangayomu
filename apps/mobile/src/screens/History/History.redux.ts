import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { toggleIncognitoMode, clearMangaHistory } from '@redux/slices/history';

const mapStateToProps = (state: AppState) => ({
  sections: state.history.sections,
  incognito: state.history.incognito,
});

const connector = connect(mapStateToProps, {
  toggleIncognitoMode,
  clearMangaHistory,
});

export type ConnectedHistoryProps = ConnectedProps<typeof connector>;

export default connector;
