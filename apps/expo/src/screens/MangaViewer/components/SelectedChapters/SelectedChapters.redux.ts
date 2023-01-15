import { AppState } from '@redux/store';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { checkAll, exitSelectionMode } from '@redux/reducers/chaptersListReducer/chaptersListReducer.actions';
import { SelectedChaptersBaseProps } from '@screens/MangaViewer/components/SelectedChapters/SelectedChapters.interfaces';
import * as mangaDownloadingActions from '@redux/reducers/mangaDownloadingReducer';
import { validateChapters } from '@redux/reducers/mangaReducer';

const mapStateToProps = (state: AppState, props: SelectedChaptersBaseProps) => {
  return {
    ...props,
    selectionMode: state.chaptersList.mode,
    numOfSelected: state.chaptersList.numOfSelected,
    selectedChapters: state.chaptersList.selected,
    hidden: state.chaptersList.hideFloatingModal,
  };
};

const connector = connect(mapStateToProps, {
  checkAll,
  exitSelectionMode,
  validateChapters,
  ...mangaDownloadingActions,
});

export type SelectedChaptersProps = ConnectedProps<typeof connector>;

export default connector;
