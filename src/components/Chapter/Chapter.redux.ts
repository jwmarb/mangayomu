import { AppState } from '@redux/store';
import { connect, ConnectedProps } from 'react-redux';
import { ChapterProps } from './Chapter.interfaces';
import * as chaptersListReducerActions from '@redux/reducers/chaptersListReducer/chaptersListReducer.actions';

const mapStateToProps = (state: AppState, props: ChapterProps) => {
  return {
    ...props,
    selectionMode: state.chaptersList.mode,
    overrideChecked: state.chaptersList.checkAll,
  };
};

const connector = connect(mapStateToProps, chaptersListReducerActions, null, { forwardRef: true });

export type ChapterReduxProps = ConnectedProps<typeof connector>;

export default connector;
