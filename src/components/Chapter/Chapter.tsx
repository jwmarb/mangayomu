import ButtonBase from '@components/Button/ButtonBase';
import { ChapterProps } from '@components/Chapter/Chapter.interfaces';
import Flex from '@components/Flex';
import { Typography } from '@components/Typography';
import MangaValidator from '@utils/MangaValidator';
import React from 'react';
import { format } from 'date-fns';
import { persistor } from '@redux/store';
import { Container } from '@components/Container';
import IconButton from '@components/IconButton';
import Icon from '@components/Icon';
import Spacer from '@components/Spacer';

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

const Chapter: React.FC<ChapterProps> = (props) => {
  const { chapter } = props;
  function handleOnPress() {}
  return (
    <ButtonBase square onPress={handleOnPress}>
      <Container horizontalPadding={3} verticalPadding={1}>
        <Flex justifyContent='space-between' alignItems='center'>
          <Flex direction='column'>
            <Typography bold>{chapter.name}</Typography>
            {displayChapterInfo(chapter)}
          </Flex>
          <IconButton icon={<Icon bundle='Feather' name='download' />} />
        </Flex>
      </Container>
    </ButtonBase>
  );
};

export default React.memo(Chapter);
