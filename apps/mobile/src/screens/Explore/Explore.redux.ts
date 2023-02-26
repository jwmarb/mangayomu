import getMangaHost from '@helpers/getMangaHost';
import { AppState } from '@redux/main';
import {
  setExplorerState,
  refreshExplorerState,
  explorerNetworkStateListenerHandler,
} from '@redux/slices/explore';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState) => ({
  source: getMangaHost(state),
  networkStatus: state.explore.internetStatus,
  hotMangas: state.explore.states.hot,
  latestMangas: state.explore.states.latest,
  suspendRendering: state.host.suspendRendering,
  loading:
    (state.explore.status.hot === 'loading' ||
      state.explore.status.latest === 'loading') &&
    state.explore.internetStatus === 'online',
  internetStatus: state.explore.internetStatus,
});

const connector = connect(mapStateToProps, {
  setExplorerState,
  refreshExplorerState,
  explorerNetworkStateListenerHandler,
});

export type ConnectedExploreProps = ConnectedProps<typeof connector>;

export default connector;
