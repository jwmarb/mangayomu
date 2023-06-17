import Box from '@components/Box';
import Stack from '@components/Stack/Stack';
import Realm from 'realm';
import Text from '@components/Text';
import { useLocalQuery, useQuery } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaSchema, SORT_CHAPTERS_BY } from '@database/schemas/Manga';
import { DEFAULT_LANGUAGE } from '@screens/MangaView/MangaView';
import { sort } from 'fast-sort';
import React from 'react';
import {
  renderItem,
  keyExtractor,
  overrideItemLayout,
  ItemSeparatorComponent,
} from './ContinueReading.flatlist';
import { FlashList } from '@shopify/flash-list';
import { UNFINISHED_MANGA_WIDTH } from '@theme/constants';
import { useTheme } from '@emotion/react';
import { useWindowDimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import Button from '@components/Button/Button';

const ContinueReading: React.FC = () => {
  const theme = useTheme();
  const mangas = useQuery(MangaSchema);
  const { width } = useWindowDimensions();
  const chapters = useLocalQuery(ChapterSchema);
  const currentlyReadingMangas = mangas.filtered(
    'currentlyReadingChapter != null && inLibrary == true',
  );
  const p = currentlyReadingMangas.reduce((prev, curr) => {
    prev[curr._id] = chapters
      .filtered(
        '_mangaId == $0 && language == $1',
        curr._id,
        curr.selectedLanguage !== 'Use default language'
          ? curr.selectedLanguage
          : DEFAULT_LANGUAGE,
      )
      .sorted('index');
    return prev;
  }, {} as Record<string, Realm.Results<ChapterSchema & Realm.Object<unknown, never>>>);
  const unfinishedMangas = currentlyReadingMangas.filter(
    (manga) => manga.currentlyReadingChapter?._id !== p[manga._id][0]?._id,
  );

  if (unfinishedMangas.length === 0) return null;

  return (
    <Stack space="s">
      <Stack
        space="s"
        mx="m"
        flex-direction="row"
        justify-content="space-between"
        align-items="center"
      >
        <Text variant="header" bold>
          Continue reading
        </Text>
        {unfinishedMangas.length > 5 && (
          <Button label={`View all ${unfinishedMangas.length} mangas`} />
        )}
      </Stack>
      <FlashList
        contentContainerStyle={{
          paddingHorizontal: width / 2 - UNFINISHED_MANGA_WIDTH / 2,
        }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        extraData={p}
        estimatedItemSize={UNFINISHED_MANGA_WIDTH}
        overrideItemLayout={(layout) => {
          layout.size = UNFINISHED_MANGA_WIDTH + theme.style.spacing.s * 2;
        }}
        horizontal
        data={unfinishedMangas.slice(0, 5)}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparatorComponent}
        snapToInterval={UNFINISHED_MANGA_WIDTH + theme.style.spacing.s * 2}
        decelerationRate="fast"
      />
    </Stack>
  );
};

export default React.memo(ContinueReading);
