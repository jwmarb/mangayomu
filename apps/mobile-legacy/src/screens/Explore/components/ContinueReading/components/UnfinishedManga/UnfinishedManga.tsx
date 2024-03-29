/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { UnfinishedMangaProps } from './';
import Box from '@components/Box';
import Stack from '@components/Stack';
import { StaticCover } from '@components/Cover';
import Text from '@components/Text';
import Icon from '@components/Icon';
import displayMessage from '@helpers/displayMessage';
import useRootNavigation from '@hooks/useRootNavigation';
import { UNFINISHED_MANGA_WIDTH } from '@theme/constants';
import useUnfinishedManga from '@hooks/useUnfinishedManga';
import Pressable from '@components/Pressable';

const UnfinishedManga: React.FC<UnfinishedMangaProps> = (props) => {
  const { manga } = props;
  const navigation = useRootNavigation();
  const { currentChapter, nextChapter } = useUnfinishedManga(manga);

  function handleOnLongPress() {
    displayMessage(manga.title);
  }
  const handleOnPress = () => {
    if (manga.currentlyReadingChapter != null)
      navigation.navigate('Reader', {
        chapter:
          manga.currentlyReadingChapter.index ===
            manga.currentlyReadingChapter.numOfPages - 1 && nextChapter != null
            ? nextChapter._id
            : manga.currentlyReadingChapter._id,
        manga: manga.link,
      });
  };
  return (
    <Box
      width={UNFINISHED_MANGA_WIDTH}
      align-self="center"
      overflow="hidden"
      background-color="paper"
      border-radius="@theme"
      border-color="@theme"
      border-width="@theme"
    >
      <Pressable onPress={handleOnPress} onLongPress={handleOnLongPress}>
        <Stack space="s" flex-direction="row" py="s" px="m">
          <StaticCover manga={manga} />
          <Box flex-shrink justify-content="center">
            <Text variant="book-title" numberOfLines={2} bold>
              {manga.title}
            </Text>
            <Stack space="s" flex-direction="row" align-items="center">
              <Text variant="book-title" numberOfLines={1} color="hint">
                {currentChapter?.name}
              </Text>
              <Text variant="bottom-tab" color="primary">
                ({manga.currentlyReadingChapter!.index + 1} /{' '}
                {manga.currentlyReadingChapter!.numOfPages})
              </Text>
            </Stack>
            <Stack space="s" flex-direction="row" align-items="center">
              <Icon type="font" name="page-next" color="primary" />
              <Text color="textSecondary" variant="book-title">
                {nextChapter?.name}
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Pressable>
    </Box>
  );
};

export default React.memo(UnfinishedManga);
