import { AppState } from '@redux/store';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { checkAll, exitSelectionMode } from '@redux/reducers/chaptersListReducer/chaptersListReducer.actions';
import { SelectedChaptersBaseProps } from '@screens/MangaViewer/components/SelectedChapters/SelectedChapters.interfaces';
import * as mangaDownloadingActions from '@redux/reducers/mangaDownloadingReducer';

const mapStateToProps = (state: AppState, props: React.PropsWithChildren<{}>) => {
  const chaptersArr = Object.entries(state.chaptersList.selected);
  return {
    ...props,
    selectionMode: state.chaptersList.mode,
    totalChapters: chaptersArr.length,
    selectedChapters: state.chaptersList.selected,
  };
};

const connector = connect(mapStateToProps, {
  checkAll,
  exitSelectionMode,
  ...mangaDownloadingActions,
});

export type SelectedChaptersProps = ConnectedProps<typeof connector> & SelectedChaptersBaseProps;

export default connector;
