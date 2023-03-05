import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState) => ({
  hotMangas: state.explore.states.hot,
  status: state.explore.status.hot,
  errors: state.explore.errors.hot,
  isOffline: state.explore.internetStatus === 'offline',
  bookHeight: state.settings.book.height,
});

const connector = connect(mapStateToProps);

export type ConnectedHotMangaListProps = ConnectedProps<typeof connector>;

export default connector;
