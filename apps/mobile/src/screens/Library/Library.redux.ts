import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState) => ({
  reversed: state.library.reversed,
  sortBy: state.library.sortBy,
  filters: state.library.filters,
  noSourcesSelectedInFilter:
    state.library.numberOfSelectedSourcesInFilter === 0,
  numberOfAppliedFilters: state.library.numberOfFiltersApplied,
});

const connector = connect(mapStateToProps);

export type ConnectedLibraryProps = ConnectedProps<typeof connector>;

export default connector;
