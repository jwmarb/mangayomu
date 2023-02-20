import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { sortLibrary, toggleLibraryReverse } from '@redux/slices/library';

const mapStateToProps = (state: AppState) => ({
  reversed: state.library.reversed,
  sortBy: state.library.sortBy,
});

const connector = connect(mapStateToProps, {
  toggleLibraryReverse,
  sortLibrary,
});

export type ConnectedLibrarySortProps = ConnectedProps<typeof connector>;

export default connector;
