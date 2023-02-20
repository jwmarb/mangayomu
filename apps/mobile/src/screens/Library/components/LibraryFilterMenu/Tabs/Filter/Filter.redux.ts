import getMangaHost from '@helpers/getMangaHost';
import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import {
  toggleGenre,
  toggleSourceVisibility,
  resetFilters,
} from '@redux/slices/library';

const mapStateToProps = (state: AppState) => ({
  host: getMangaHost(state),
  hosts: state.host.name,
  filterStates: state.library.filters,
});

const connector = connect(mapStateToProps, {
  toggleSourceVisibility,
  toggleGenre,
  resetFilters,
});

export type ConnectedLibraryFilterProps = ConnectedProps<typeof connector>;

export default connector;
