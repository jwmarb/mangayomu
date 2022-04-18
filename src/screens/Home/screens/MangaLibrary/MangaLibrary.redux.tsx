import { BottomTabParamList } from '@navigators/BottomTab/BottomTab.interfaces';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { AppState } from '@redux/store';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState, props: BottomTabScreenProps<BottomTabParamList, 'Library'>) => {
  return {
    ...props,
    mangas: state.library.mangas,
  };
};

const connector = connect(mapStateToProps);

export type MangaLibraryProps = ConnectedProps<typeof connector>;
