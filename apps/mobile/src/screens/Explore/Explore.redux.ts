import getMangaHost from '@helpers/getMangaHost';
import { AppState } from '@redux/main';
import { setExplorerState } from '@redux/slices/explore';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState) => ({
  source: getMangaHost(state),
  strSources: state.host.name,
});

const connector = connect(mapStateToProps, { setExplorerState });

export type ConnectedExploreProps = ConnectedProps<typeof connector>;

export default connector;
