import ButtonBase from '@components/Button/ButtonBase';
import Flex from '@components/Flex';
import React from 'react';
import { ChapterContainer } from '@components/Chapter/Chapter.base';
import useAnimatedMounting from '@hooks/useAnimatedMounting';
import Animated from 'react-native-reanimated';
import useMountedEffect from '@hooks/useMountedEffect';
import useMangaSource from '@hooks/useMangaSource';
import { DownloadStatus } from '@utils/DownloadManager/DownloadManager.interfaces';
import Checkbox from '@components/Checkbox/Checkbox';
import connector, { ChapterReduxProps } from './Chapter.redux';
import ChapterTitle from './components/ChapterTitle';
import ChapterDownloadProgress from './components/ChapterDownloadProgress';
import ChapterDownloadStatus from './components/ChapterDownloadStatus';
import { useChapterStateFromRedux } from './Chapter.helpers';
import { cursors } from '@redux/reducers/chaptersListReducer/chaptersListReducer.actions';
import Spacer from '@components/Spacer';
import StorageManager from '@utils/StorageManager';
import DownloadManager from '@utils/DownloadManager';
import ExpoStorage from '@utils/ExpoStorage';
import { getKey } from '@redux/reducers/chaptersListReducer/chaptersListReducer';

const Chapter: React.FC<ChapterReduxProps> = (props) => {
  const {
    chapter,
    manga,
    isSelected,
    selectionMode,
    exitSelectionMode,
    enterSelectionMode,
    checkChapter,
    totalPages,
    totalProgress,
    downloadedPages,
    downloadSelected,
    cancelAllForSeries,
    status,
  } = props;

  function handleOnCheck(e: boolean) {
    checkChapter(e, chapter);
  }

  async function handleOnPress() {
    switch (selectionMode) {
      case 'normal':
        // const downloadManager = DownloadManager.ofWithManga(chapter, manga);
        // await cancelAll();
        break;
      case 'selection':
        checkChapter(!isSelected, chapter);
        break;
    }
  }

  const style = useAnimatedMounting();

  function handleOnLongPress() {
    switch (selectionMode) {
      case 'normal':
        enterSelectionMode();
        break;
      case 'selection':
        exitSelectionMode();
        break;
    }
  }

  const handleOnDownload = React.useCallback(() => {
    downloadSelected({ [getKey(chapter)]: null }, manga);
  }, [chapter, manga]);

  return (
    <>
      <Animated.View style={style}>
        <ButtonBase square onPress={handleOnPress} onLongPress={handleOnLongPress}>
          <ChapterContainer>
            <Flex justifyContent='space-between' alignItems='center'>
              <ChapterTitle chapter={chapter} />
              <Flex alignItems='center'>
                <ChapterDownloadProgress />
                <ChapterDownloadStatus
                  chapterKey={chapter.link}
                  status={status}
                  onDownload={handleOnDownload}
                  progress={totalProgress}
                  mangaKey={manga.link}
                />
                <Spacer x={1} />
                {selectionMode === 'selection' && <Checkbox checked={isSelected} onChange={handleOnCheck} />}
              </Flex>
            </Flex>
          </ChapterContainer>
        </ButtonBase>
      </Animated.View>
    </>
  );
};

export default connector(React.memo(Chapter));
