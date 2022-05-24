import Spacer from '@components/Spacer';
import { Typography } from '@components/Typography';
import MangaValidator from '@utils/MangaValidator';
import React from 'react';
import { ChapterTitleProps } from './ChapterTitle.interfaces';
import { format } from 'date-fns';
import Flex from '@components/Flex';

const displayChapterInfo = (chapter: any) => {
  if (MangaValidator.hasDate(chapter)) {
    return (
      <>
        <Spacer y={1} />
        <Typography variant='body2' color='textSecondary'>
          {format(Date.parse(chapter.date), 'MM/dd/yyyy')}
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
      <Typography bold>{chapter.name}</Typography>
      {displayChapterInfo(chapter)}
    </Flex>
  );
};

export default React.memo(ChapterTitle);
