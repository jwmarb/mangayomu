import { BottomTabParamList } from '@navigators/BottomTab/BottomTab.interfaces';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { AppState } from '@redux/store';
import { connect, ConnectedProps } from 'react-redux';
import {
  searchInLibrary,
  setSortMethod,
  toggleReverseSort,
  restoreLibrary,
} from '@redux/reducers/mangalibReducer/mangalibReducer.actions';
import { appendNewChapters } from '@redux/reducers/mangaReducer';

const mapStateToProps = (state: AppState, props: BottomTabScreenProps<BottomTabParamList, 'Library'>) => {
  return {
    ...props,
    mangas: state.library.mangas,
    mangasList: state.library.mangasList.toArray(),
    history: state.mangas,
    cols: state.settings.mangaCover.perColumn,
    fontSize: state.settings.mangaCover.fontSize,
    query: state.library.search,
    orientation: state.settings.deviceOrientation,
    type: state.settings.mangaCover.style,
    useRecyclerListView: state.settings.advanced.useRecyclerListView,
    sort: state.library.sort,
    reversed: state.library.reversed,
  };
};

const connector = connect(mapStateToProps, {
  searchInLibrary,
  appendNewChapters,
  setSortMethod,
  toggleReverseSort,
  restoreLibrary,
});

export type MangaLibraryProps = ConnectedProps<typeof connector>;

export default connector;
