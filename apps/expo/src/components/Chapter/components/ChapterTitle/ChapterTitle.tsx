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
  const { chapter, isCurrentlyBeingRead } = props;
  return (
    <Flex direction='column'>
      <Flex alignItems='center'>
        <Typography
          bold
          color={
            chapter.dateRead == null
              ? Date.parse(chapter.date) <= Date.now() - 8.64e7
                ? 'textPrimary'
                : 'secondary'
              : 'disabled'
          }>
          {chapter.name}
        </Typography>
        <Spacer x={2} />
        {chapter.dateRead != null && isCurrentlyBeingRead && (
          <Typography variant='body2' color='primary'>
            ({chapter.indexPage + 1} / {chapter.totalPages})
          </Typography>
        )}
      </Flex>
      {displayChapterInfo(chapter)}
    </Flex>
  );
};

export default React.memo(ChapterTitle);
