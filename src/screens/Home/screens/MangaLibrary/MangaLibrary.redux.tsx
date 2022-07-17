import { BottomTabParamList } from '@navigators/BottomTab/BottomTab.interfaces';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { AppState } from '@redux/store';
import { connect, ConnectedProps } from 'react-redux';
import { searchInLibrary } from '@redux/reducers/mangalibReducer/mangalibReducer.actions';

const mapStateToProps = (state: AppState, props: BottomTabScreenProps<BottomTabParamList, 'Library'>) => {
  return {
    ...props,
    mangas: state.library.mangas,
    history: state.mangas,
    cols: state.settings.mangaCover.perColumn,
    fontSize: state.settings.mangaCover.fontSize,
    query: state.library.search,
    orientation: state.settings.deviceOrientation,
  };
};

const connector = connect(mapStateToProps, { searchInLibrary });

export type MangaLibraryProps = ConnectedProps<typeof connector>;

export default connector;
