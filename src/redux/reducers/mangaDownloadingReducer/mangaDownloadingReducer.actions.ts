import { ChaptersListReducerState } from '@redux/reducers/chaptersListReducer/chaptersListReducer.interfaces';
import { AppDispatch, AppState } from '@redux/store';
import { Manga } from '@services/scraper/scraper.interfaces';
import CancelablePromise from '@utils/CancelablePromise';
import DownloadManager, { DownloadStatus } from '@utils/DownloadManager';
import StorageManager from '@utils/StorageManager';
import pLimit from 'p-limit';
const downloadingKeys: Record<string, string | null> = {};

export type StateGetter = () => AppState;

export const downloadSelected = (selected: ChaptersListReducerState['selected'], manga: Manga) => {
  return (dispatch: AppDispatch, getState: StateGetter) => {
    dispatch({ type: 'APPEND_TO_DOWNLOAD_REDUCER', selected, manga, chapters: getState().mangas[manga.link].chapters });
  };
};

export const cancelDownload = (mangaKey: string, chapterKey: string) => {
  return async (dispatch: AppDispatch, getState: StateGetter) => {
    if (mangaKey in getState().downloading.mangas) {
      if (
        mangaKey in getState().downloading.mangas &&
        getState().downloading.mangas[mangaKey]!.chaptersToDownload.length <= 1 &&
        getState().downloading.mangas[mangaKey]!.chaptersToDownload[0] === chapterKey
      )
        delete downloadingKeys[mangaKey];
      try {
        const downloadManager = DownloadManager.ofWithManga(
          getState().mangas[mangaKey].chapters[chapterKey],
          getState().mangas[mangaKey]
        );
        switch (downloadManager.getStatus()) {
          case DownloadStatus.DOWNLOADING:
          case DownloadStatus.RESUME_DOWNLOADING:
          case DownloadStatus.START_DOWNLOADING:
          case DownloadStatus.PAUSED:
            await downloadManager.cancel();
            break;
          case DownloadStatus.QUEUED:
            downloadManager.unqueue();
            break;
        }
      } catch (e) {
        console.error(e);
      } finally {
        dispatch({ type: 'CANCEL_DOWNLOAD', mangaKey, chapterKey });
      }
    }
  };
};

export const cancelAllForSeries = (mangaKey: string) => {
  return async (dispatch: AppDispatch, getState: StateGetter) => {
    if (mangaKey in getState().downloading.mangas) {
      try {
        delete downloadingKeys[mangaKey];
        const keys = Object.keys(getState().downloading.mangas[mangaKey]!.chapters);
        for (let i = keys.length - 1; i >= 0; i--) {
          const key = keys[i];
          const downloadManager = DownloadManager.ofWithManga(
            getState().mangas[mangaKey].chapters[key],
            getState().mangas[mangaKey]
          );
          switch (downloadManager.getStatus()) {
            case DownloadStatus.DOWNLOADING:
            case DownloadStatus.RESUME_DOWNLOADING:
            case DownloadStatus.START_DOWNLOADING:
            case DownloadStatus.PAUSED:
              await downloadManager.cancel();
              break;
            case DownloadStatus.QUEUED:
              downloadManager.unqueue();
              break;
          }
        }
        // if (downloadingKeys[mangaKey] != null) {
        //   const downloadManager = DownloadManager.ofWithManga(
        //     getState().mangas[mangaKey].chapters[downloadingKeys[mangaKey]!],
        //     getState().mangas[mangaKey]
        //   );
        //   await downloadManager.cancel();
        // }
      } catch (e) {
        console.error(e);
      } finally {
        dispatch({
          type: 'CANCEL_ALL_FOR_SERIES',
          mangaKey,
          chapters: getState().downloading.mangas[mangaKey]!.chaptersToDownload,
        });
      }
    }
  };
};

export const downloadAll = () => {
  return (dispatch: AppDispatch, getState: StateGetter) => {
    let canceled: boolean = false;

    return {
      cancel: async () => {
        canceled = true;
        for (const [mangaKey, chapterKey] of Object.entries(downloadingKeys)) {
          if (chapterKey) {
            const downloadManager = DownloadManager.ofWithManga(
              getState().mangas[mangaKey].chapters[chapterKey],
              getState().mangas[mangaKey]
            );
            switch (downloadManager.getStatus()) {
              case DownloadStatus.START_DOWNLOADING:
              case DownloadStatus.RESUME_DOWNLOADING:
              case DownloadStatus.DOWNLOADING:
                if (mangaKey in downloadingKeys) await downloadManager.pause();
                break;
            }
          }
        }
      },
      start: () =>
        new Promise<void>((res1, rej1) => {
          Promise.all(
            Object.keys(getState().downloading.mangas).map((mangaKey) => {
              {
                const limit = pLimit(1);
                downloadingKeys[mangaKey] = null;

                for (const chapterKey in getState().downloading.mangas[mangaKey]?.chapters) {
                  function isNotCanceled() {
                    if (canceled || mangaKey in downloadingKeys === false) {
                      if (limit.pendingCount > 0) limit.clearQueue();
                      return false;
                    }
                    return true;
                  }
                  limit(
                    () =>
                      new Promise<void>((res, rej) => {
                        if (isNotCanceled()) {
                          const downloadManager = DownloadManager.ofWithManga(
                            getState().mangas[mangaKey].chapters[chapterKey],
                            getState().mangas[mangaKey]
                          );

                          if (isNotCanceled())
                            dispatch({ type: 'CHAPTER_DOWNLOAD_LISTENER', mangaKey, chapterKey, downloadManager });

                          const interval = setInterval(() => {
                            if (isNotCanceled())
                              dispatch({ type: 'CHAPTER_DOWNLOAD_LISTENER', mangaKey, chapterKey, downloadManager });
                            else clearInterval(interval);
                          }, 500);

                          const callback = () => {
                            clearInterval(interval);
                            if (isNotCanceled()) {
                              dispatch({ type: 'CHAPTER_DOWNLOAD_COMPLETE', mangaKey, chapterKey });
                              downloadingKeys[mangaKey] = null;

                              return res();
                            } else return rej(`${chapterKey} has been paused`);
                          };

                          downloadingKeys[mangaKey] = chapterKey;

                          switch (downloadManager.getStatus()) {
                            case DownloadStatus.PAUSED:
                              if (isNotCanceled()) {
                                downloadManager.resume().then(callback);
                              } else clearInterval(interval);
                              break;
                            case DownloadStatus.QUEUED:
                              if (isNotCanceled()) {
                                downloadManager.download().then(callback);
                              } else clearInterval(interval);

                              break;
                            case DownloadStatus.DOWNLOADED:
                              clearInterval(interval);
                              dispatch({ type: 'CHAPTER_DOWNLOAD_COMPLETE', mangaKey, chapterKey });
                              downloadingKeys[mangaKey] = null;
                              return res();
                            default:
                              clearInterval(interval);
                              rej1(
                                `Unable to download ${chapterKey} ${downloadManager.getError()}\nstatus: ${downloadManager.getStatus()}`
                              );
                              break;
                          }
                        } else rej(`${chapterKey} has been paused before it could even be downloaded`);
                      })
                  );
                }
              }
            })
          ).finally(res1);
        }),
    };
  };
};
