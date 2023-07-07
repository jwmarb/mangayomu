/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { UnfinishedMangaProps } from './UnfinishedManga.interfaces';
import Box from '@components/Box';
import Stack from '@components/Stack';
import { StaticCover } from '@components/Cover';
import Text from '@components/Text';
import Icon from '@components/Icon';
import { useTheme } from '@emotion/react';
import displayMessage from '@helpers/displayMessage';
import useRootNavigation from '@hooks/useRootNavigation';
import { UNFINISHED_MANGA_WIDTH } from '@theme/constants';
import useUnfinishedManga from '@hooks/useUnfinishedManga';
import { Pressable } from 'react-native';

const UnfinishedManga: React.FC<UnfinishedMangaProps> = (props) => {
  const { manga, chapters } = props;
  const theme = useTheme();
  const navigation = useRootNavigation();

  const { currentChapter, nextChapter } = useUnfinishedManga(manga, chapters);

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
        manga: manga._id,
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
      <Pressable
        onPress={handleOnPress}
        android_ripple={{
          color: theme.palette.action.ripple,
        }}
        onLongPress={handleOnLongPress}
      >
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
