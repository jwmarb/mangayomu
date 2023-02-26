import getMangaHost from '@helpers/getMangaHost';
import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import {
  initializeUniversalSearch,
  errorUniversalSearchResults,
  exitUniversalSearch,
  appendUniversalSearchResults,
  universalSearchResultHandler,
  setQuery,
} from '@redux/slices/browse';
import { HomeTabProps } from '@navigators/Home/Home.interfaces';

const mapStateToProps = (state: AppState, props: HomeTabProps<'Browse'>) => ({
  sources: state.host.name,
  pinnedSources: Object.keys(state.host.pinned),
  hostsWithUniversalSearch: state.host.name.filter(
    (x) => state.host.hostsConfig[x].useWithUniversalSearch === true,
  ),
  inputSubmitted: state.browse.inputSubmitted,
  loading: state.browse.loading,
  searchStates: state.browse.states,
  initialQuery: props.route.params?.initialQuery,
  query: state.browse.query,
});

const connector = connect(mapStateToProps, {
  initializeUniversalSearch,
  errorUniversalSearchResults,
  exitUniversalSearch,
  appendUniversalSearchResults,
  universalSearchResultHandler,
  setQuery,
});

export type ConnectedBrowseProps = ConnectedProps<typeof connector>;

export default connector;
