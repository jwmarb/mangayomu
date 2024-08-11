import { Dimensions, View } from 'react-native';
import { MangaChapter } from '@mangayomu/mangascraper';
import React from 'react';
import Text from '@/components/primitives/Text';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';
import Icon from '@/components/primitives/Icon';
import Progress from '@/components/primitives/Progress';
import {
  useCurrentChapterContext,
  useIsFetchingChapter,
  useReaderBackgroundColor,
  useReaderManga,
  useReadingDirection,
} from '@/screens/Reader/context';
import useTheme from '@/hooks/useTheme';
import Contrast from '@/components/primitives/Contrast';
import { BackgroundColor } from '@/stores/settings';
import { ReadingDirection } from '@/models/schema';

const { width, height } = Dimensions.get('window');

const styles = createStyles((theme) => ({
  container: {
    width,
    height,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.style.size.s,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.style.size.m,
  },
}));

export type ChapterDividerProps = {
  type: 'CHAPTER_DIVIDER';
  previous?: MangaChapter;
  next?: MangaChapter;
};

export default React.memo(function ChapterDivider(props: ChapterDividerProps) {
  const { previous, next } = props;
  const currentChapter = useCurrentChapterContext();
  const isFetching = useIsFetchingChapter();
  const style = useStyles(styles);
  const theme = useTheme();
  const manga = useReaderManga();
  const backgroundColor = useReaderBackgroundColor();
  const readingDirection = useReadingDirection();
  return (
    <Contrast
      contrast={
        (theme.mode === 'light' &&
          (backgroundColor === BackgroundColor.BLACK ||
            backgroundColor === BackgroundColor.GRAY)) ||
        (theme.mode === 'dark' && backgroundColor === BackgroundColor.WHITE)
      }
    >
      <View style={style.container}>
        {isFetching && <Progress size="large" />}
        <View style={style.textContainer}>
          {next?.link === currentChapter?.link && (
            <>
              {readingDirection === ReadingDirection.LEFT_TO_RIGHT && (
                <Icon
                  color="primary"
                  type="icon"
                  name="arrow-left"
                  size="large"
                />
              )}
              <Text bold color="textSecondary">
                Previous: <Text>{previous?.name}</Text>
              </Text>
              {readingDirection === ReadingDirection.RIGHT_TO_LEFT && (
                <Icon
                  color="primary"
                  type="icon"
                  name="arrow-right"
                  size="large"
                />
              )}
            </>
          )}
          {previous?.link === currentChapter?.link && (
            <>
              {readingDirection === ReadingDirection.RIGHT_TO_LEFT && (
                <Icon
                  color="primary"
                  type="icon"
                  name="arrow-left"
                  size="large"
                />
              )}
              <Text bold color="textSecondary">
                Next: <Text>{next?.name}</Text>
              </Text>
              {readingDirection === ReadingDirection.LEFT_TO_RIGHT && (
                <Icon
                  color="primary"
                  type="icon"
                  name="arrow-right"
                  size="large"
                />
              )}
            </>
          )}
        </View>
      </View>
    </Contrast>
  );
});
