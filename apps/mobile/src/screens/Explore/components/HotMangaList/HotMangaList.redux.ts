import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState) => ({
  hotMangas: state.explore.states.hot,
  status: state.explore.status.hot,
});

const connector = connect(mapStateToProps);

export type ConnectedHotMangaListProps = ConnectedProps<typeof connector>;

export default connector;
