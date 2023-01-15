import ButtonBase from '@components/Button/ButtonBase';
import Flex from '@components/Flex';
import React from 'react';
import { ChapterContainer } from '@components/Chapter/Chapter.base';
import useAnimatedMounting from '@hooks/useAnimatedMounting';
import Animated, { FadeIn } from 'react-native-reanimated';
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
import { useRootNavigation } from '@navigators/Root';

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
    width,
    cancelAllForSeries,
    isCurrentlyBeingRead,
    status,
  } = props;

  function handleOnCheck(e: boolean) {
    checkChapter(e, chapter);
  }

  const navigation = useRootNavigation();

  async function handleOnPress() {
    switch (selectionMode) {
      case 'normal':
        // const downloadManager = DownloadManager.ofWithManga(chapter, manga);
        // console.log(downloadManager.getStatus());
        navigation.navigate('Reader', { chapterKey: chapter.link, mangaKey: manga.link });
        break;
      case 'selection':
        checkChapter(!isSelected, chapter);
        break;
    }
  }

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
    <Animated.View entering={FadeIn}>
      <ButtonBase square onPress={handleOnPress} onLongPress={handleOnLongPress}>
        <ChapterContainer width={width}>
          <Flex justifyContent='space-between' alignItems='center'>
            <ChapterTitle chapter={chapter} isCurrentlyBeingRead={isCurrentlyBeingRead} />
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
  );
};

export default connector(React.memo(Chapter));
