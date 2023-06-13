import React from 'react';
import { UnfinishedMangaProps } from './UnfinishedManga.interfaces';
import Box from '@components/Box';
import { RectButton } from 'react-native-gesture-handler';
import Stack from '@components/Stack';
import { StaticCover } from '@components/Cover';
import Text from '@components/Text';
import Icon from '@components/Icon';
import { useTheme } from '@emotion/react';
import displayMessage from '@helpers/displayMessage';
import { ChapterSchema } from '@database/schemas/Chapter';
import { useLocalRealm } from '@database/main';
import { moderateScale } from 'react-native-size-matters';
import integrateSortedList from '@helpers/integrateSortedList';
import { SORT_CHAPTERS_BY_LEGACY } from '@database/schemas/Manga';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useRootNavigation from '@hooks/useRootNavigation';

const UnfinishedManga: React.FC<UnfinishedMangaProps> = (props) => {
  const { manga, chapters } = props;
  const { width } = useWindowDimensions();
  const localRealm = useLocalRealm();
  const insets = useSafeAreaInsets();
  const maxWidth = width - moderateScale(32);
  const theme = useTheme();
  const navigation = useRootNavigation();
  const currentlyReadingChapterOfRandomManga = localRealm.objectForPrimaryKey(
    ChapterSchema,
    manga.currentlyReadingChapter._id,
  );

  const currentChapter = localRealm.objectForPrimaryKey(
    ChapterSchema,
    manga.currentlyReadingChapter._id,
  );

  const { indexOf } = integrateSortedList(
    chapters,
    SORT_CHAPTERS_BY_LEGACY['Chapter number'],
  );

  const nextChapter:
    | (ChapterSchema & Realm.Object<unknown, never>)
    | undefined =
    chapters[
      indexOf(
        currentlyReadingChapterOfRandomManga as ChapterSchema &
          Realm.Object<unknown, never>,
      ) - 1
    ];

  function handleOnLongPress() {
    displayMessage(manga.title);
  }
  const handleOnPress = () => {
    navigation.navigate('Reader', {
      chapter:
        manga.currentlyReadingChapter.index ===
        manga.currentlyReadingChapter.numOfPages - 1
          ? nextChapter._id
          : manga.currentlyReadingChapter._id,
      manga: manga._id,
    });
  };
  return (
    <Box
      width={width + insets.left + insets.right}
      align-items="center"
      justify-content="center"
    >
      <Box
        align-self="center"
        width={maxWidth}
        overflow="hidden"
        background-color="paper"
        border-radius="@theme"
        style={{
          borderColor: theme.palette.borderColor,
        }}
        border-width={1}
      >
        <RectButton
          shouldCancelWhenOutside
          onPress={handleOnPress}
          rippleColor={theme.palette.action.ripple}
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
                  ({manga.currentlyReadingChapter.index + 1} /{' '}
                  {manga.currentlyReadingChapter.numOfPages})
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
        </RectButton>
      </Box>
    </Box>
  );
};

export default React.memo(UnfinishedManga);
