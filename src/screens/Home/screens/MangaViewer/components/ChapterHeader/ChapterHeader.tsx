import { Typography, Spacer, Icon, Button } from '@components/core';
import { ChapterHeaderContainer } from '@screens/Home/screens/MangaViewer/components/ChapterHeader/ChapterHeader.base';
import { ChapterHeaderProps } from '@screens/Home/screens/MangaViewer/components/ChapterHeader/ChapterHeader.interfaces';
import React from 'react';

const ChapterHeader: React.FC<ChapterHeaderProps> = (props) => {
  const { numOfChapters } = props;
  return (
    <ChapterHeaderContainer>
      <Typography variant='subheader'>Chapters - {numOfChapters}</Typography>
      <Spacer x={2} />
      <Button title='Sort' icon={<Icon bundle='MaterialCommunityIcons' name='sort' />} iconPlacement='right' />
    </ChapterHeaderContainer>
  );
};

export default React.memo(ChapterHeader);
