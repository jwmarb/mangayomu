import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { MangaSearchResultProps } from './MangaSearchResult.interfaces';

const mapStateToProps = (state: AppState, props: MangaSearchResultProps) => ({
  status: state.browse.states[props.source].status,
  mangas: state.browse.states[props.source].mangas,
  error: state.browse.states[props.source].error,
  source: props.source,
});

const connector = connect(mapStateToProps);

export type ConnectedMangaSearchResultProps = ConnectedProps<typeof connector>;

export default connector;
