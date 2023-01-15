import { ChaptersListReducerState } from '@redux/reducers/chaptersListReducer/chaptersListReducer.interfaces';
import { AppDispatch, AppState } from '@redux/store';
import { Manga } from '@services/scraper/scraper.interfaces';
import CancelablePromise from '@utils/CancelablePromise';
import DownloadManager, { DownloadStatus } from '@utils/DownloadManager';
import StorageManager from '@utils/StorageManager';
import pLimit from 'p-limit';

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
        dispatch({ type: 'DELETE_DOWNLOADING_KEY', mangaKey });
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
        dispatch({ type: 'DELETE_DOWNLOADING_KEY', mangaKey });
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
    let canceled = false;

    return {
      cancel: async () => {
        canceled = true;
        for (const [mangaKey, chapterKey] of Object.entries(getState().downloading.downloadingKeys)) {
          if (chapterKey) {
            const downloadManager = DownloadManager.ofWithManga(
              getState().mangas[mangaKey].chapters[chapterKey],
              getState().mangas[mangaKey]
            );
            switch (downloadManager.getStatus()) {
              case DownloadStatus.START_DOWNLOADING:
              case DownloadStatus.RESUME_DOWNLOADING:
              case DownloadStatus.DOWNLOADING:
                console.log(`${chapterKey} -> !!! PAUSED !!!`);
                if (mangaKey in getState().downloading.downloadingKeys) await downloadManager.pause();

                break;
            }
          }
        }
      },
      start: () =>
        new Promise<void>((res1, rej1) => {
          Promise.all(
            Object.keys(getState().downloading.mangas).map((mangaKey) => {
              const limit = pLimit(1);
              dispatch({ type: 'SET_DOWNLOADING_KEY', mangaKey, key: null });

              new Promise(() => {
                for (const chapterKey in getState().downloading.mangas[mangaKey]?.chapters) {
                  const downloadManager = DownloadManager.ofWithManga(
                    getState().mangas[mangaKey].chapters[chapterKey],
                    getState().mangas[mangaKey]
                  );
                  limit(
                    () =>
                      new Promise<void>((res, rej) => {
                        if (getState().downloading.downloadingKeys[mangaKey] === null && !canceled)
                          switch (downloadManager.getStatus()) {
                            case DownloadStatus.START_DOWNLOADING:
                              canceled = true;
                              console.log(`${chapterKey} -> SKIPPING BUT HAS STATUS START_DOWNLOADING`);
                              setTimeout(() => dispatch({ type: 'RERUN_DOWNLOADS' }), 1000);
                              res1();
                              break;
                            case DownloadStatus.RESUME_DOWNLOADING:
                              canceled = true;
                              console.log(`${chapterKey} -> SKIPPING BUT HAS STATUS RESUME_DOWNLOADING`);
                              setTimeout(() => dispatch({ type: 'RERUN_DOWNLOADS' }), 1000);
                              res1();
                              break;
                            case DownloadStatus.QUEUED: {
                              console.log(`${chapterKey} -> START DOWNLOAD`);
                              dispatch({ type: 'SET_DOWNLOADING_KEY', mangaKey, key: chapterKey });
                              const interval = setInterval(() => {
                                if (!canceled)
                                  dispatch({
                                    type: 'CHAPTER_DOWNLOAD_LISTENER',
                                    mangaKey,
                                    chapterKey,
                                    downloadManager,
                                  });
                                else {
                                  clearInterval(interval);
                                  if (downloadManager.getStatus() === DownloadStatus.START_DOWNLOADING) {
                                    dispatch({ type: 'RERUN_DOWNLOADS' });
                                    downloadManager.pause();
                                  }
                                }
                              }, 500);
                              downloadManager.download().then(() => {
                                dispatch({ type: 'SET_DOWNLOADING_KEY', mangaKey, key: null });

                                clearInterval(interval);
                                if (!canceled && downloadManager.getProgress() >= 1) {
                                  console.log(`${chapterKey} -> DOWNLOAD COMPLETE`);
                                  dispatch({ type: 'CHAPTER_DOWNLOAD_COMPLETE', mangaKey, chapterKey });
                                  return res1();
                                } else {
                                  console.log(
                                    `${chapterKey} -> CALLBACK: Called before it downloaded. This must have been paused. Progress was at ${downloadManager.getProgress()}`
                                  );
                                  return rej1();
                                }
                              });
                              break;
                            }
                            case DownloadStatus.PAUSED: {
                              console.log(`${chapterKey} -> RESUME DOWNLOAD`);
                              dispatch({ type: 'SET_DOWNLOADING_KEY', mangaKey, key: chapterKey });

                              const interval = setInterval(() => {
                                if (!canceled)
                                  dispatch({
                                    type: 'CHAPTER_DOWNLOAD_LISTENER',
                                    mangaKey,
                                    chapterKey,
                                    downloadManager,
                                  });
                                else {
                                  clearInterval(interval);
                                  if (downloadManager.getStatus() === DownloadStatus.RESUME_DOWNLOADING)
                                    downloadManager.pause();
                                }
                              }, 500);
                              downloadManager.resume().then(() => {
                                dispatch({ type: 'SET_DOWNLOADING_KEY', mangaKey, key: null });

                                clearInterval(interval);
                                if (!canceled) {
                                  console.log(`${chapterKey} -> DOWNLOAD COMPLETE > Resumed`);
                                  dispatch({ type: 'CHAPTER_DOWNLOAD_COMPLETE', mangaKey, chapterKey });
                                  return res1();
                                } else {
                                  console.log(
                                    `${chapterKey} -> CALLBACK: Called while it has been resumed for downloading. This must have been paused. canceled = ${canceled}`
                                  );
                                  return rej1();
                                }
                              });
                              break;
                            }
                            case DownloadStatus.DOWNLOADED:
                              console.log(`${chapterKey} -> SKIPPED`);
                              // clearInterval(interval);
                              dispatch({ type: 'CHAPTER_DOWNLOAD_COMPLETE', mangaKey, chapterKey });
                              // downloadingKeys[mangaKey] = null;
                              return res();
                            case DownloadStatus.IDLE:
                              console.log(`${chapterKey} -> IDLE, not even queued. Skipping...`);
                              return res();
                            default:
                              return rej1(
                                `Unable to download ${chapterKey} ${downloadManager.getError()}\nstatus: ${downloadManager.getStatus()}\ndownloadingKeys[mangaKey] = ${
                                  getState().downloading.downloadingKeys[mangaKey]
                                }`
                              );
                          }
                      })
                  );
                }
              }).finally(() => {
                console.log('reached end');
              });
            })
          ).finally(res1);
        }),
    };
  };
};
