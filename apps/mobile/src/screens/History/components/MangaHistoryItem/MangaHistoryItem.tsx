import BookListItem from '@components/BookListItem/BookListItem';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { useLocalRealm } from '@database/main';
import { LocalMangaSchema } from '@database/schemas/LocalManga';
import useDialog from '@hooks/useDialog';
import useRootNavigation from '@hooks/useRootNavigation';
import useUserHistory from '@hooks/useUserHistory';
import { MangaHistoryItemProps } from './';
import { format } from 'date-fns';
import React from 'react';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import Box from '@components/Box';

const MangaHistoryItem: React.FC<MangaHistoryItemProps> = (props) => {
  const localRealm = useLocalRealm();
  const { item } = props;
  const { manga: _manga, chapter: _chapter, _id } = item;
  const { deleteMangaFromHistory } = useUserHistory();
  const manga = localRealm.objectForPrimaryKey(LocalMangaSchema, _manga);
  const chapter = localRealm.objectForPrimaryKey(LocalChapterSchema, _chapter);
  const navigation = useRootNavigation();
  const dialog = useDialog();

  function handleOnDeleteFromHistory() {
    dialog.open({
      title: 'Remove from history?',
      // eslint-disable-next-line quotes
      message: "This will delete this manga's entry. Are you sure?",
      actions: [
        { text: 'Cancel' },
        {
          text: 'Remove',
          type: 'destructive',
          onPress: () => {
            deleteMangaFromHistory(_id);
          },
        },
      ],
    });
  }

  function handleOnPress() {
    navigation.navigate('Reader', {
      chapter: item.chapter,
      manga: item.manga,
    });
  }

  if (manga == null || chapter == null)
    return (
      <Box>
        {manga == null && <Text>{item.manga} is null</Text>}
        {chapter == null && <Text>{item.chapter} is null</Text>}
      </Box>
    );

  return (
    <BookListItem
      manga={manga}
      onPress={handleOnPress}
      end={
        <IconButton
          onPress={handleOnDeleteFromHistory}
          icon={<Icon type="font" name="trash-can-outline" />}
        />
      }
    >
      <Stack space="s" flex-direction="row" align-items="center">
        <Text color="textSecondary" variant="book-title" numberOfLines={1}>
          {chapter.name}
        </Text>
        <Text color="textSecondary">•</Text>
        <Text color="textSecondary" bold>
          {format(item.date, 'h:mm a')}
        </Text>
      </Stack>
    </BookListItem>
  );
};

export default React.memo(MangaHistoryItem);
