import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { toggleLibraryReverse, sortLibrary } from '@redux/slices/library';
import { MangaSchema } from '@database/schemas/Manga';

const mapStateToProps = (
  state: AppState,
  props: { filtered: MangaSchema[] },
) => ({
  filtered: props.filtered,
});

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
