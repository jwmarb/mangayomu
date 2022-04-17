import { Button, Flex, Icon, IconButton, Progress, Spacer } from '@components/core';
import useViewingManga from '@hooks/useViewingManga';
import { ReadingMangaInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { useAppDispatch } from '@redux/store';
import { MangaActionProps } from '@screens/Home/screens/MangaViewer/components/MangaAction/MangaAction.interfaces';
import { useMangaSource } from '@services/scraper';
import React from 'react';
import { ActivityIndicator } from 'react-native';

const MangaAction: React.FC<MangaActionProps> = (props) => {
  const { manga } = props;
  const userMangaInfo = useViewingManga(manga) as unknown as ReadingMangaInfo | null; // This can be null if the user views this for the first time
  const dispatch = useAppDispatch();
  const handleOnAddToLibrary = () => {
    if (userMangaInfo) {
      dispatch({ type: 'TOGGLE_LIBRARY', payload: manga });
    }
  };
  return (
    <Flex grow>
      <Flex fullWidth grow justifyContent='flex-end' direction='column'>
        <Flex alignItems='center'>
          <Button
            title={userMangaInfo ? userMangaInfo.currentlyReadingChapter?.name ?? 'Read' : ''}
            icon={userMangaInfo ? <Icon bundle='Feather' name='book' /> : <Progress />}
            variant='contained'
            expand
            disabled={!userMangaInfo}
          />
          <Spacer x={1} />
          <Button
            disabled={!userMangaInfo}
            color='secondary'
            variant={userMangaInfo?.inLibrary ? 'outline' : 'contained'}
            title={userMangaInfo ? (userMangaInfo?.inLibrary ? 'Remove' : 'Add') : ''}
            icon={
              userMangaInfo ? (
                userMangaInfo.inLibrary ? (
                  <Icon bundle='MaterialCommunityIcons' name='bookmark-minus-outline' />
                ) : (
                  <Icon bundle='MaterialCommunityIcons' name='bookmark-plus' />
                )
              ) : (
                <Progress />
              )
            }
            onPress={handleOnAddToLibrary}
          />
          {/* <IconButton
            icon={
              userMangaInfo?.inLibrary ? (
                <Icon bundle='MaterialCommunityIcons' name='bookmark-minus-outline' />
              ) : (
                <Icon bundle='MaterialCommunityIcons' name='bookmark-plus' />
              )
            }
            color='secondary'
            onPress={handleOnAddToLibrary}
          /> */}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default React.memo(MangaAction);
