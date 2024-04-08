import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';
import { Q } from '@nozbe/watermelondb';
import Filter, { OptionChange } from '@/components/composites/Filter';
import useLocalManga from '@/hooks/useLocalManga';
import { LocalManga } from '@/models/LocalManga';
import {
  ChapterSortOption,
  ChapterSortOptionStrings,
  Table,
} from '@/models/schema';
import useMangaViewManga from '@/screens/MangaView/hooks/useMangaViewManga';
import useBoolean from '@/hooks/useBoolean';

const sortOptions = Object.values(ChapterSortOption).filter(
  (x) => typeof x === 'number',
) as ChapterSortOption[];

export default function Sort() {
  const manga = useMangaViewManga();
  const database = useDatabase();
  const id = useLocalManga(manga, (localManga) => localManga.id);

  const [sortOption, setSortOption] = React.useState<ChapterSortOption>(
    ChapterSortOption.CHAPTER_NUMBER,
  );
  const [reversed, toggleReversed] = useBoolean();

  React.useEffect(() => {
    async function initialize() {
      const results = await database
        .get(Table.LOCAL_MANGAS)
        .query(Q.where('link', manga.link));
      if (results.length > 0) {
        const [localManga] = results as LocalManga[];
        setSortOption((prev) => localManga.sortChaptersBy ?? prev);
        toggleReversed((prev) => localManga.isSortReversed ?? prev);
      }
    }
    initialize();
  }, []);

  React.useEffect(() => {
    async function updateDb() {
      if (id != null) {
        await database.write(async () => {
          const localManga = (await database
            .get(Table.LOCAL_MANGAS)
            .find(id)) as LocalManga;
          await localManga.update(() => {
            localManga.sortChaptersBy = sortOption;
            localManga.isSortReversed = reversed;
          });
        });
      }
    }

    updateDb();
  }, [sortOption, reversed]);

  const handleOnOption = React.useCallback(
    (option: OptionChange) => {
      switch (option.type) {
        case 'sort':
          setSortOption(option.value as ChapterSortOption);
          toggleReversed(option.reversed);
          break;
      }
    },
    [id],
  );
  return (
    <Filter onOption={handleOnOption}>
      {sortOptions.map((x) => (
        <Filter.Sort
          key={x}
          selected={x === sortOption}
          value={x}
          title={ChapterSortOptionStrings[x]}
          reversed={reversed}
        />
      ))}
    </Filter>
  );
}
