import { MangaCoverProps } from '@components/Manga/Cover/Cover.interfaces';
import { adjustColumns } from '@redux/reducers/settingsReducer/settingsReducer.actions';
import { AppDispatch, AppState } from '@redux/store';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';

const mapStateToProps = (state: AppState, props: MangaCoverProps) => {
  return {
    ...props,
    cols: state.settings.mangaCover.perColumn,
    coverStyle: state.settings.mangaCover.style,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  const boundActions = bindActionCreators({ adjustColumns }, dispatch);
  return boundActions;
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export type ProcessedMangaCoverProps = ConnectedProps<typeof connector>;

export default connector;
