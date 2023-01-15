import { RootStackParamList } from '@navigators/Root/Root.interfaces';
import { StackScreenProps } from '@react-navigation/stack';
import { AppState } from '@redux/store';
import { DownloadingChapterProps } from '@screens/ChapterDownloads/components/DownloadingChapter/DownloadingChapter.interfaces';
import DownloadManager, { DownloadStatus } from '@utils/DownloadManager';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState, props: StackScreenProps<RootStackParamList, 'ChapterDownloads'>) => {
  return {
    ...props,
    manga: state.mangas[props.route.params.mangaKey],
    chaptersToDownload: state.downloading.mangas[props.route.params.mangaKey]?.chaptersToDownload,
  };
};

const connector = connect(mapStateToProps);

export type ConnectedChapterDownloadsProps = ConnectedProps<typeof connector>;

export default connector;
