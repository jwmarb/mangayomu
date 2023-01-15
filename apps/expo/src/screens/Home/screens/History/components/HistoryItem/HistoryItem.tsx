import ButtonBase from '@components/Button/ButtonBase';
import Flex from '@components/Flex';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Cover from '@components/Manga/Cover';
import Spacer from '@components/Spacer';
import { Typography } from '@components/Typography';
import { useRootNavigation } from '@navigators/Root';
import { HistoryItemContainer } from '@screens/Home/screens/History/components/HistoryItem/HistoryItem.base';
import connector, {
  ConnectedHistoryItemProps,
} from '@screens/Home/screens/History/components/HistoryItem/HistoryItem.redux';
import { format } from 'date-fns';
import React from 'react';

const HistoryItem: React.FC<ConnectedHistoryItemProps> = (props) => {
  const { manga, chapter, dateRead, sectionIndex, removeFromHistory, currentlyReadingChapter, mangaKey } = props;
  const chapterDoesNotExist = chapter == null;
  const navigation = useRootNavigation();
  function handleOnRead() {
    navigation.navigate('Reader', { chapterKey: chapter.link, mangaKey: manga.link });
  }
  function handleOnDelete() {
    removeFromHistory(sectionIndex, { currentlyReadingChapter, dateRead, mangaKey, sectionIndex });
  }
  function handleOnPress() {
    navigation.navigate('MangaViewer', {
      manga: { imageCover: manga.imageCover, link: manga.link, source: manga.source, title: manga.title },
    });
  }

  function handleOnNonExisting() {
    alert('This chapter has been modified or deleted by the source');
  }
  return (
    <HistoryItemContainer>
      <ButtonBase opacity onPress={handleOnPress}>
        <Cover uri={manga.imageCover} fixedSize='small' />
      </ButtonBase>
      <Spacer x={1} />
      <Flex shrink>
        <ButtonBase opacity onPress={handleOnPress}>
          <Flex direction='column'>
            <Typography numberOfLines={2}>{manga.title}</Typography>
            <Spacer y={1} />
            {chapterDoesNotExist ? (
              <Typography variant='body2' color='secondary' numberOfLines={1}>
                Chapter Not Found
              </Typography>
            ) : (
              <Typography variant='body2' color='textSecondary' numberOfLines={1}>
                {chapter.name ?? `Chapter ${chapter.index + 1}`} - {format(dateRead, 'h:mm a')}
              </Typography>
            )}
          </Flex>
        </ButtonBase>
      </Flex>
      <Spacer x={1} />
      <Flex grow justifyContent='flex-end'>
        <IconButton icon={<Icon bundle='Feather' name='trash-2' />} onPress={handleOnDelete} />
        {chapterDoesNotExist ? (
          <IconButton
            icon={<Icon bundle='MaterialCommunityIcons' name='exclamation' color='secondary' size='small' />}
            onPress={handleOnNonExisting}
            color='secondary'
          />
        ) : (
          <IconButton icon={<Icon bundle='Feather' name='play' />} onPress={handleOnRead} />
        )}
      </Flex>
    </HistoryItemContainer>
  );
};

export default connector(React.memo(HistoryItem));