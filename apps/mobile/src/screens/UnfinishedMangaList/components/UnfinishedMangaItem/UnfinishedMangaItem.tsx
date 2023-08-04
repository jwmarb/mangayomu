import React from 'react';
import { UnfinishedMangaItemProps } from './UnfinishedMangaItem.interfaces';
import Text from '@components/Text/Text';
import BookListItem from '@components/BookListItem/BookListItem';
import useUnfinishedManga from '@hooks/useUnfinishedManga';
import Stack from '@components/Stack/Stack';
import Icon from '@components/Icon/Icon';
import useRootNavigation from '@hooks/useRootNavigation';

const UnfinishedMangaItem: React.FC<UnfinishedMangaItemProps> = (props) => {
  const { manga, chapters } = props;
  const navigation = useRootNavigation();
  const { nextChapter, currentChapter } = useUnfinishedManga(manga, chapters);
  const handleOnPress = () => {
    if (manga.currentlyReadingChapter != null)
      navigation.navigate('Reader', {
        chapter:
          manga.currentlyReadingChapter.index ===
            manga.currentlyReadingChapter.numOfPages - 1 && nextChapter != null
            ? nextChapter._id
            : manga.currentlyReadingChapter._id,
        manga: manga.link,
      });
  };
  return (
    <BookListItem manga={manga} onPress={handleOnPress}>
      <Text color="disabled" variant="book-title">
        {currentChapter?.name}
      </Text>
      <Stack space="s" flex-direction="row" align-items="center">
        <Icon type="font" name="book-open-variant" color="primary" />
        <Text variant="book-title" color="textSecondary">
          {nextChapter?.name}
        </Text>
      </Stack>
    </BookListItem>
  );
};

export default React.memo(UnfinishedMangaItem);
