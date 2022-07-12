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
    state: state.chaptersList.mangasInDownloading[props.route.params.mangaKey],
    chapters:
      (state.chaptersList.mangasInDownloading[props.route.params.mangaKey]?.chaptersCollection.reduce(
        (prev, x): DownloadingChapterProps[] => {
          if (
            DownloadManager.ofWithManga(
              state.mangas[props.route.params.mangaKey].chapters[x.link],
              state.mangas[props.route.params.mangaKey]
            ).getStatus() === DownloadStatus.DOWNLOADED
          )
            return prev;
          prev.push({
            manga: state.mangas[props.route.params.mangaKey],
            chapter: state.mangas[props.route.params.mangaKey].chapters[x.link],
            downloadState: state.chaptersList.mangasInDownloading[props.route.params.mangaKey].chapters[x.link],
          });
          return prev;
        },
        [] as DownloadingChapterProps[]
      ) as DownloadingChapterProps[]) ?? [],
  };
};

const connector = connect(mapStateToProps);

export type ConnectedChapterDownloadsProps = ConnectedProps<typeof connector>;

export default connector;
