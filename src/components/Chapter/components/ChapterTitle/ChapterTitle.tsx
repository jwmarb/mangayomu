import Spacer from '@components/Spacer';
import { Typography } from '@components/Typography';
import MangaValidator from '@utils/MangaValidator';
import React from 'react';
import { ChapterTitleProps } from './ChapterTitle.interfaces';
import { format, formatDistanceToNow, isToday } from 'date-fns';
import Flex from '@components/Flex';

const displayChapterInfo = (chapter: any) => {
  const parsed = Date.parse(chapter.date);
  if (MangaValidator.hasDate(chapter)) {
    return (
      <>
        <Spacer y={1} />
        <Typography variant='body2' color='textSecondary'>
          {Date.now() - 6.048e8 < parsed
            ? formatDistanceToNow(parsed, { addSuffix: true })
            : format(parsed, 'MMMM dd, yyyy')}
        </Typography>
      </>
    );
  }
  return null;
};

const ChapterTitle: React.FC<ChapterTitleProps> = (props) => {
  const { chapter } = props;
  return (
    <Flex direction='column'>
      <Typography bold color={Date.parse(chapter.date) <= Date.now() - 8.64e7 ? 'textPrimary' : 'secondary'}>
        {chapter.name}
      </Typography>
      {displayChapterInfo(chapter)}
    </Flex>
  );
};

export default React.memo(ChapterTitle);
