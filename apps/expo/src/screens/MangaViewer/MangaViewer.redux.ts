import { RootStackParamList } from '@navigators/Root/Root.interfaces';
import { StackScreenProps } from '@react-navigation/stack';
import { AppState, MapStateToProps } from '@redux/store';
import * as mangaReducerActions from '@redux/reducers/mangaReducer/mangaReducer.actions';
import * as chaptersListReducerActions from '@redux/reducers/chaptersListReducer/chaptersListReducer.actions';
import { connect, ConnectedProps } from 'react-redux';
import MangaHost from '@services/scraper/scraper.abstract';
import { exitSelectionMode } from '@redux/reducers/chaptersListReducer';
import { Dimensions } from 'react-native';

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
    selectionMode: state.chaptersList.mode,
    checked: state.chaptersList.checkAll,
    inLibrary: manga.link in state.library.mangas,
    extendedState: {
      chaptersList: state.chaptersList,
      mangas: state.mangas,
      chaptersInManga: state.mangas[manga.link]?.chapters ?? {},
      metas: state.downloading.metas[manga.link],
      manga: state.mangas[manga.link],
      deviceOrientation: state.settings.deviceOrientation,
      width: Dimensions.get('window').width,
    },
  };
};

const connector = connect(mapStateToProps, { ...mangaReducerActions, ...chaptersListReducerActions });

export type MangaViewerProps = ConnectedProps<typeof connector>;

export default connector;
