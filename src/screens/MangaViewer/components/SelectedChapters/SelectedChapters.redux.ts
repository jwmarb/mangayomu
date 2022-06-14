import { AppState } from '@redux/store';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  checkAll,
  exitSelectionMode,
  downloadAllSelected,
  pauseAllSelected,
} from '@redux/reducers/chaptersListReducer/chaptersListReducer.actions';
import { SelectedChaptersBaseProps } from '@screens/MangaViewer/components/SelectedChapters/SelectedChapters.interfaces';

const mapStateToProps = (state: AppState, props: React.PropsWithChildren<{}>) => {
  const chaptersArr = Object.entries(state.chaptersList.chapters);
  return {
    ...props,
    selectionMode: state.chaptersList.mode,
    totalChapters: chaptersArr.length,
    selectedChapters: chaptersArr.reduce((prev, [key, value]) => {
      if (value.checked) return { ...prev, [key]: value };
      return prev;
    }, {} as typeof state.chaptersList.chapters),
  };
};

const connector = connect(mapStateToProps, {
  checkAll,
  exitSelectionMode,
  downloadAllSelected,
  pauseAllSelected,
});

export type SelectedChaptersProps = ConnectedProps<typeof connector> & SelectedChaptersBaseProps;

export default connector;
