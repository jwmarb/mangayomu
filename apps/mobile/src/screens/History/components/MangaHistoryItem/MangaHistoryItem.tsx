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
import { Manga } from '@mangayomu/mangascraper';
import connector, {
  ConnectedMangaHistoryItemProps,
} from '@screens/History/components/MangaHistoryItem/MangaHistoryItem.redux';
import { format } from 'date-fns';
import React from 'react';

const MangaHistoryItem: React.FC<ConnectedMangaHistoryItemProps> = (props) => {
  const { item, sectionDate } = props;
  const { deleteMangaFromHistory } = useUserHistory();
  const localRealm = useLocalRealm();
  const { manga, chapter } = item;
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
            deleteMangaFromHistory({ sectionDate, item });
          },
        },
      ],
    });
  }

  function handleOnPress() {
    if (manga != null && chapter != null)
      navigation.navigate('Reader', {
        chapter: item.chapter.link,
        manga: item.manga.link,
      });
    else if (manga != null) navigation.navigate('MangaView', manga);
  }

  return (
    <BookListItem
      manga={
        localRealm.objectForPrimaryKey(LocalMangaSchema, manga.link) ?? manga
      }
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

export default connector(React.memo(MangaHistoryItem));
