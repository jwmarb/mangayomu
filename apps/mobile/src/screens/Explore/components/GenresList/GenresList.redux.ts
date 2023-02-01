import getMangaHost from '@helpers/getMangaHost';
import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState) => ({
  source: getMangaHost(state),
});

const connector = connect(mapStateToProps);

export type ConnectedGenresListProps = ConnectedProps<typeof connector>;

export default connector;
