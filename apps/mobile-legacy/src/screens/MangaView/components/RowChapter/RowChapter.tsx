import Box from '@components/Box';
import Stack from '@components/Stack';
import Text from '@components/Text';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';
import { RowChapterProps } from './';
import { format, formatDistanceToNow } from 'date-fns';
import useRootNavigation from '@hooks/useRootNavigation';
import { useQuery } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import Pressable from '@components/Pressable';

export const ROW_CHAPTER_HEIGHT = moderateScale(60);

const RowChapter: React.FC<RowChapterProps> = (props) => {
  const {
    mangaKey,
    date: parsed,
    isReading,
    name,
    chapterKey,
    subname,
  } = props;
  const navigation = useRootNavigation();
  const isRecent = Date.now() - 6.048e7 < parsed;
  const isWithinWeek = Date.now() - 6.048e8 < parsed;
  const k = useQuery(
    ChapterSchema,
    (collection) => collection.filtered('link = $0', chapterKey),
    [chapterKey],
  )[0] as unknown as ChapterSchema | undefined;
  const formattedDate = React.useMemo(
    () =>
      isWithinWeek
        ? formatDistanceToNow(parsed, { addSuffix: true })
        : format(parsed, 'MMMM dd, yyyy'),
    [parsed, isWithinWeek],
  );
  function handleOnPress() {
    if (mangaKey != null)
      navigation.navigate('Reader', {
        chapter: chapterKey,
        manga: mangaKey,
      });
  }

  return (
    <Pressable onPress={handleOnPress}>
      <Stack
        space="s"
        mx="m"
        height={ROW_CHAPTER_HEIGHT}
        align-items="center"
        flex-direction="row"
      >
        {/* <Box align-self="center">
          <Checkbox checked />
        </Box> */}
        <Box align-self="center">
          <Stack space="s" flex-direction="row">
            <Text
              color={k?.dateRead || isReading ? 'disabled' : 'textPrimary'}
              bold={!k?.dateRead}
            >
              {name}
            </Text>
            {(k?.dateRead || isReading) && k?.indexPage != null && (
              <Text color="primary" variant="book-title">
                ({k.indexPage + 1} / {k.numberOfPages})
              </Text>
            )}
          </Stack>
          {subname && (
            <Text
              color="textSecondary"
              variant="body-sub"
              numberOfLines={2}
              italic
            >
              {subname}
            </Text>
          )}
          <Text color={isRecent ? 'secondary' : 'textSecondary'}>
            {formattedDate}
          </Text>
        </Box>
      </Stack>
    </Pressable>
  );
};

export default React.memo(RowChapter);
