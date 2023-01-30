import getMangaHost from '@helpers/getMangaHost';
import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState) => ({
  source: getMangaHost(state),
  strSources: state.host.name,
});

const connector = connect(mapStateToProps);

export type ConnectedExploreProps = ConnectedProps<typeof connector>;

export default connector;
