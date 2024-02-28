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
import useBoolean from '@hooks/useBoolean';

const MangaHistoryItem: React.FC<
  MangaHistoryItemProps & { valid: boolean; toggle: (val: boolean) => void }
> = (props) => {
  const localRealm = useLocalRealm();
  const { item, toggle, valid } = props;
  const { manga: _manga, chapter: _chapter, _id } = item;
  const manga = localRealm.objectForPrimaryKey(LocalMangaSchema, _manga);
  const chapter = localRealm.objectForPrimaryKey(LocalChapterSchema, _chapter);
  const navigation = useRootNavigation();
  const dialog = useDialog();
  const { deleteMangaFromHistory } = useUserHistory();

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
            toggle(false);
          },
        },
      ],
    });
  }
  React.useEffect(() => {
    if (!valid) deleteMangaFromHistory(_id);
  }, [valid]);

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

const Wrapper: React.FC<MangaHistoryItemProps> = (props) => {
  const [valid, toggle] = useBoolean(props.item.isValid());

  if (valid)
    return <MangaHistoryItem valid={valid} toggle={toggle} {...props} />;
  return null;
};

export default React.memo(Wrapper);
