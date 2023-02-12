import Box from '@components/Box';
import Checkbox from '@components/Checkbox';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import React from 'react';
import { RectButton } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import { RowChapterProps } from './RowChapter.interfaces';
import { format, formatDistanceToNow } from 'date-fns';
import { useRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';

export const ROW_CHAPTER_HEIGHT = moderateScale(60);

const RowChapter: React.FC<RowChapterProps> = (props) => {
  if ('loading' in props) return null;
  const { rowChapterKey } = props;
  const realm = useRealm();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const rowChapter = realm.objectForPrimaryKey<ChapterSchema>(
    'Chapter',
    rowChapterKey,
  )!;
  const parsed = Date.parse(rowChapter.date);
  const isRecent = Date.now() - 6.048e7 < parsed;
  const isWithinWeek = Date.now() - 6.048e8 < parsed;
  const formattedDate = React.useMemo(
    () =>
      isWithinWeek
        ? formatDistanceToNow(parsed, { addSuffix: true })
        : format(parsed, 'MMMM dd, yyyy'),
    [parsed, isWithinWeek],
  );
  return (
    <RectButton>
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
          <Text
            color={rowChapter.dateRead ? 'disabled' : 'textPrimary'}
            bold={!rowChapter.dateRead}
          >
            {rowChapter.name}
          </Text>
          <Text color={isRecent ? 'secondary' : 'textSecondary'}>
            {formattedDate}
          </Text>
        </Box>
      </Stack>
    </RectButton>
  );
};

export default React.memo(RowChapter);
