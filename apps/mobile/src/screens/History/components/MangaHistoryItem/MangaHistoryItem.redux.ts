import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import React from 'react';
import { MangaHistoryItemProps } from '@screens/History/components/MangaHistoryItem/MangaHistoryItem.interfaces';
import { deleteMangaFromHistory } from '@redux/slices/history';

const mapStateToProps = (state: AppState, props: MangaHistoryItemProps) =>
  props;

const connector = connect(mapStateToProps, { deleteMangaFromHistory });

export type ConnectedMangaHistoryItemProps = ConnectedProps<typeof connector>;

export default connector;
