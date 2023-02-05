import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState) => ({
  latestMangas: state.explore.states.latest,
  status: state.explore.status.latest,
  errors: state.explore.errors.latest,
});

const connector = connect(mapStateToProps);

export type ConnectedLatestMangaListProps = ConnectedProps<typeof connector>;

export default connector;
