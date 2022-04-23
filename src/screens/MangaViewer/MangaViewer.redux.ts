import { RootStackParamList } from '@navigators/Root/Root.interfaces';
import { StackScreenProps } from '@react-navigation/stack';
import { AppState, MapStateToProps } from '@redux/store';
import * as mangaReducerActions from '@redux/reducers/mangaReducer/mangaReducer.actions';
import { connect, ConnectedProps } from 'react-redux';
import MangaHost from '@services/scraper/scraper.abstract';

const mapStateToProps = (state: AppState, props: StackScreenProps<RootStackParamList, 'MangaViewer'>) => {
  const {
    route: {
      params: { manga },
    },
  } = props;
  return {
    ...props,
    userMangaInfo: state.mangas[manga.link],
    source: MangaHost.availableSources.get(manga.source)!,
  };
};

const connector = connect(mapStateToProps, mangaReducerActions);

export type MangaViewerProps = ConnectedProps<typeof connector>;

export default connector;
