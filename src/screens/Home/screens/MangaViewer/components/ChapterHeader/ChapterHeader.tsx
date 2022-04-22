import { Typography, Spacer, Icon, Button, Modal, ListItem, List } from '@components/core';
import { ChapterHeaderContainer } from '@screens/Home/screens/MangaViewer/components/ChapterHeader/ChapterHeader.base';
import { ChapterHeaderProps } from '@screens/Home/screens/MangaViewer/components/ChapterHeader/ChapterHeader.interfaces';
import React from 'react';

const ChapterHeader: React.FC<ChapterHeaderProps> = (props) => {
  const { chapters, handleOnOpenModal } = props;

  return (
    <>
      <ChapterHeaderContainer>
        <Typography variant='subheader'>Chapters - {chapters?.length ?? '...'}</Typography>
        <Spacer x={2} />
        <Button
          title='Sort'
          icon={<Icon bundle='MaterialCommunityIcons' name='sort' />}
          iconPlacement='right'
          onPress={handleOnOpenModal}
        />
      </ChapterHeaderContainer>
    </>
  );
};

export default React.memo(ChapterHeader);
