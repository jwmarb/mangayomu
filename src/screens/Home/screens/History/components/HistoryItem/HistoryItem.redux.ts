import { AppState } from '@redux/store';
import { connect, ConnectedProps } from 'react-redux';
import React from 'react';
import { HistoryItemProps } from '@screens/Home/screens/History/components/HistoryItem/HistoryItem.interfaces';
import { removeFromHistory } from '@redux/reducers/mangaHistoryReducer/mangaHistoryReducer.actions';

const mapStateToProps = (state: AppState, props: React.PropsWithChildren<HistoryItemProps>) => ({
  ...props,
  manga: state.mangas[props.mangaKey],
  chapter: state.mangas[props.mangaKey].chapters[props.currentlyReadingChapter],
});

const connector = connect(mapStateToProps, { removeFromHistory });

export type ConnectedHistoryItemProps = ConnectedProps<typeof connector>;

export default connector;
