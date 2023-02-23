import getMangaHost from '@helpers/getMangaHost';
import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import {
  toggleGenre,
  toggleSourceVisibility,
  resetFilters,
} from '@redux/slices/library';
import { FilterProps } from './Filter.interfaces';

const mapStateToProps = (state: AppState, props: FilterProps) => ({
  filteredMangas: props.filtered,
  filterStates: state.library.filters,
});

const connector = connect(mapStateToProps, {
  toggleSourceVisibility,
  toggleGenre,
  resetFilters,
});

export type ConnectedLibraryFilterProps = ConnectedProps<typeof connector>;

export default connector;
