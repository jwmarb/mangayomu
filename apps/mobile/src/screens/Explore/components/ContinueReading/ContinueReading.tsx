import Box from '@components/Box';
import Stack from '@components/Stack/Stack';
import Text from '@components/Text';
import { useLocalQuery, useQuery } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaSchema, SORT_CHAPTERS_BY } from '@database/schemas/Manga';
import { DEFAULT_LANGUAGE } from '@screens/MangaView/MangaView';
import { inPlaceSort } from 'fast-sort';
import React from 'react';
import {
  renderItem,
  keyExtractor,
  overrideItemLayout,
} from './ContinueReading.flatlist';
import { FlashList } from '@shopify/flash-list';
import { UNFINISHED_MANGA_HEIGHT } from '@theme/constants';

const ContinueReading: React.FC = () => {
  const mangas = useQuery(MangaSchema);
  const chapters = useLocalQuery(ChapterSchema);
  const currentlyReadingMangas = mangas.filtered(
    'currentlyReadingChapter != null && inLibrary == true',
  );
  const p = currentlyReadingMangas.reduce((prev, curr) => {
    prev[curr._id] = inPlaceSort(
      Array.from(
        chapters.filtered(
          `_mangaId == "${curr._id}" && language == "${
            curr.selectedLanguage !== 'Use default language'
              ? curr.selectedLanguage
              : DEFAULT_LANGUAGE
          }"`,
        ),
      ),
    ).desc(SORT_CHAPTERS_BY['Chapter number']);
    return prev;
  }, {} as Record<string, (ChapterSchema & Realm.Object<unknown, never>)[]>);
  const unfinishedMangas = currentlyReadingMangas.filter(
    (manga) => manga.currentlyReadingChapter._id !== p[manga._id][0]._id,
  );

  return (
    <Stack space="s">
      <Box mx="m">
        <Text variant="header" bold>
          Continue reading
        </Text>
      </Box>
      <FlashList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        extraData={p}
        estimatedItemSize={UNFINISHED_MANGA_HEIGHT}
        overrideItemLayout={overrideItemLayout}
        horizontal
        data={unfinishedMangas}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </Stack>
  );
};

export default React.memo(ContinueReading);
