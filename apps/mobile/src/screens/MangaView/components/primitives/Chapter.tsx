import React from 'react';
import { View } from 'react-native';
import { MangaChapter } from '@mangayomu/mangascraper';
import { useNavigation } from '@react-navigation/native';
import Pressable from '@/components/primitives/Pressable';
import Text from '@/components/primitives/Text';
import { createStyles } from '@/utils/theme';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import useHistoryEntry from '@/screens/MangaView/hooks/useHistoryEntry';
import { Chapter as ChapterModel } from '@/models/Chapter';
import { Manga } from '@/models/Manga';
import useIsCurrentlyReadingThisChapter from '@/screens/MangaView/hooks/useIsCurrentlyReadingThisChapter';
import {
  useMangaViewManga,
  useMangaViewSource,
  useMangaViewUnparsedData,
  useMangaViewUnparsedManga,
} from '@/screens/MangaView/context';

export const BASE_CHAPTER_HEIGHT = 64;
export const CHAPTER_HEIGHT_EXTENDED = BASE_CHAPTER_HEIGHT + 20;

export type ChapterProps = {
  chapter: unknown;
};

const styles = (extended: boolean) =>
  createStyles((theme) => ({
    pressable: {
      paddingVertical: theme.style.size.l,
      paddingHorizontal: theme.style.screen.paddingHorizontal,
      height: extended ? CHAPTER_HEIGHT_EXTENDED : BASE_CHAPTER_HEIGHT,
      justifyContent: 'center',
      backgroundColor: theme.palette.background.default,
    },
    titleContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: theme.style.size.l,
      alignItems: 'center',
    },
  }));

const composedStyles = [true, false].reduce(
  (prev, curr) => {
    prev[curr ? 1 : 0] = styles(curr);
    return prev;
  },
  {} as Record<number, ReturnType<typeof styles>>,
);

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

function getDate(date: number | Date) {
  const d = new Date(date);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function isChapter(x: unknown): x is MangaChapter {
  return (
    typeof x === 'object' &&
    x != null &&
    'name' in x &&
    typeof x.name === 'string' &&
    'date' in x &&
    'link' in x &&
    typeof x.link === 'string'
  );
}

function Chapter(props: ChapterProps) {
  const source = useMangaViewSource();
  const tmangameta = useMangaViewUnparsedData();
  const unparsed = useMangaViewUnparsedManga();
  const manga = useMangaViewManga();
  const chapter = isChapter(props.chapter)
    ? props.chapter
    : source.toChapter(props.chapter, tmangameta);
  const contrast = useContrast();
  const style = useStyles(composedStyles[chapter.subname ? 1 : 0], contrast);
  const date = React.useMemo(() => getDate(chapter.date), [chapter.date]);
  const navigation = useNavigation();
  const pageInfo = ChapterModel.useObservation(
    chapter,
    ({ pagesCount, currentPage, id }) => ({
      currentPage,
      pagesCount,
      id,
    }),
    (prev, current) =>
      prev?.currentPage === current.currentPage &&
      prev.pagesCount === current.pagesCount &&
      prev.id === current.id,
  );
  const isCurrentlyReadingThisChapter = useIsCurrentlyReadingThisChapter(
    manga,
    pageInfo?.id,
  );

  function handleOnPress() {
    navigation.navigate('Reader', {
      manga: unparsed,
      source: source.NAME,
      chapter: props.chapter,
    });
  }

  // console.log(isCurrentlyReadingThisChapter);

  return (
    <Pressable onPress={handleOnPress} style={style.pressable}>
      <View>
        <View style={style.titleContainer}>
          <Text
            color={
              pageInfo != null
                ? isCurrentlyReadingThisChapter
                  ? 'disabled'
                  : 'textSecondary'
                : 'textPrimary'
            }
          >
            {chapter.name}
          </Text>
          {pageInfo != null && (
            <Text
              variant="chip"
              color={isCurrentlyReadingThisChapter ? 'primary' : 'disabled'}
            >
              ({pageInfo.currentPage}/{pageInfo.pagesCount})
            </Text>
          )}
        </View>
        {chapter.subname && (
          <Text
            numberOfLines={1}
            italic
            variant="body2"
            color="textSecondary"
            bold
          >
            {chapter.subname}
          </Text>
        )}
        <Text color="textSecondary" numberOfLines={1} variant="body2">
          {date}
        </Text>
      </View>
    </Pressable>
  );
}

function Skeleton(props: { type?: 'subname' | 'no-subname' }) {
  const contrast = useContrast();
  const style = useStyles(
    composedStyles[props.type === 'subname' ? 1 : 0],
    contrast,
  );

  return (
    <View style={style.pressable}>
      <View>
        <Text.Skeleton />
        {props.type === 'subname' && <Text.Skeleton />}
        <Text.Skeleton variant="body2" />
      </View>
    </View>
  );
}

const memoSkeleton = React.memo(Skeleton);

const memoChapter = React.memo(Chapter) as ReturnType<
  typeof React.memo<typeof Chapter>
> & {
  Skeleton: typeof memoSkeleton;
};

memoChapter.Skeleton = memoSkeleton;

export default memoChapter;
