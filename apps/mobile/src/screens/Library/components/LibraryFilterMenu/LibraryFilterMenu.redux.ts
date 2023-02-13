import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { toggleLibraryReverse, sortLibrary } from '@redux/slices/library';

const mapStateToProps = (state: AppState) => state.library;

const connector = connect(
  mapStateToProps,
  {
    sortLibrary,
    toggleLibraryReverse,
  },
  null,
  { forwardRef: true },
);

export type ConnectedLibraryFilterMenuProps = ConnectedProps<typeof connector>;

export default connector;
