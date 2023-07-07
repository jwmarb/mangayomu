import Box from '@components/Box';
import Stack from '@components/Stack';
import Text from '@components/Text';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';
import { RowChapterProps } from './RowChapter.interfaces';
import { format, formatDistanceToNow } from 'date-fns';
import useRootNavigation from '@hooks/useRootNavigation';
import { useTheme } from '@emotion/react';
import { Pressable } from 'react-native';

export const ROW_CHAPTER_HEIGHT = moderateScale(60);

const RowChapter: React.FC<RowChapterProps> = (props) => {
  const {
    mangaKey,
    date,
    isReading,
    name,
    indexPage,
    numberOfPages,
    dateRead,
    chapterKey,
  } = props;
  const navigation = useRootNavigation();
  const theme = useTheme();
  const parsed = Date.parse(date);
  const isRecent = Date.now() - 6.048e7 < parsed;
  const isWithinWeek = Date.now() - 6.048e8 < parsed;
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
    <Pressable
      onPress={handleOnPress}
      android_ripple={{
        color: theme.palette.action.ripple,
      }}
    >
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
              color={dateRead || isReading ? 'disabled' : 'textPrimary'}
              bold={!dateRead}
            >
              {name}
            </Text>
            {(dateRead || isReading) && (
              <Text color="primary" variant="book-title">
                ({indexPage + 1} / {numberOfPages})
              </Text>
            )}
          </Stack>
          <Text color={isRecent ? 'secondary' : 'textSecondary'}>
            {formattedDate}
          </Text>
        </Box>
      </Stack>
    </Pressable>
  );
};

export default React.memo(RowChapter);
