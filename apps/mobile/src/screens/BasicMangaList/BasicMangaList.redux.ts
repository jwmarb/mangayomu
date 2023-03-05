import { RootStackProps } from '@navigators/Root/Root.interfaces';
import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (
  state: AppState,
  props: RootStackProps<'BasicMangaList'>,
) => ({
  navigation: props.navigation,
  mangas: state.explore.states[props.route.params.stateKey],
  title:
    props.route.params.stateKey === 'latest'
      ? 'Recently updated'
      : 'Trending updates',
  bookWidth: state.settings.book.width,
  bookHeight: state.settings.book.height,
});

const connector = connect(mapStateToProps);

export type ConnectedBasicMangaListProps = ConnectedProps<typeof connector>;

export default connector;
