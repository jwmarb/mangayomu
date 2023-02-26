import { RootStackProps } from '@navigators/Root/Root.interfaces';
import { AppState } from '@redux/main';
import { addIfNewSourceToLibrary } from '@redux/slices/library';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (
  state: AppState,
  props: RootStackProps<'MangaView'>,
) => ({ ...props, internetStatus: state.explore.internetStatus });

const connector = connect(mapStateToProps, { addIfNewSourceToLibrary });

export type ConnectedMangaViewProps = ConnectedProps<typeof connector>;

export default connector;
