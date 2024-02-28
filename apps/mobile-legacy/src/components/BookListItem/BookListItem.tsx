import React from 'react';
import Box from '@components/Box';
import { MANGA_LIST_ITEM_HEIGHT } from '@theme/constants';
import Stack from '@components/Stack';
import { StaticCover } from '@components/Cover';
import Text from '@components/Text';
import displayMessage from '@helpers/displayMessage';
import { MangaSchema } from '@database/schemas/Manga';
import { Manga } from '@mangayomu/mangascraper/src';
import { LocalMangaSchema } from '@database/schemas/LocalManga';
import Pressable from '@components/Pressable';

export interface BookListItemProps extends React.PropsWithChildren {
  manga: Manga | MangaSchema | LocalMangaSchema;
  start?: React.ReactNode;
  end?: React.ReactNode;
  onPress?: () => void;
}

const BookListItem: React.FC<BookListItemProps> = (props) => {
  const { manga, children, end, start, onPress } = props;
  function handleOnLongPress() {
    displayMessage(manga.title);
  }
  return (
    <Pressable onLongPress={handleOnLongPress} onPress={onPress}>
      <Box
        px="m"
        py="s"
        height={MANGA_LIST_ITEM_HEIGHT}
        justify-content="center"
      >
        <Stack space="s" flex-direction="row" justify-content="space-between">
          {start}
          <Stack
            space="s"
            flex-direction="row"
            align-items="center"
            flex-shrink
          >
            <StaticCover manga={manga} />
            <Box align-self="center" flex-shrink>
              <Text bold variant="book-title" numberOfLines={2}>
                {manga.title}
              </Text>
              {children}
            </Box>
          </Stack>
          {end}
        </Stack>
      </Box>
    </Pressable>
  );
};

export default BookListItem;
