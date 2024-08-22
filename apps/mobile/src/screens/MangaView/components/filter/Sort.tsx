import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';
import Filter, { OptionChange } from '@/components/composites/Filter';
import { LocalManga } from '@/models/LocalManga';
import {
  ChapterSortOption,
  ChapterSortOptionStrings,
  Table,
} from '@/models/schema';
import useBoolean from '@/hooks/useBoolean';
import { useMangaViewManga } from '@/screens/MangaView/context';

const sortOptions = [
  ...new Set(
    Object.values(ChapterSortOption).filter((x) => typeof x === 'number'),
  ),
] as ChapterSortOption[];

export default function Sort() {
  const manga = useMangaViewManga();
  const database = useDatabase();
  const id = LocalManga.useRow(manga, (localManga) => localManga.id, {
    onInitialize(localManga) {
      setSortOption((prev) => localManga.sortChaptersBy ?? prev);
      toggleReversed((prev) => localManga.isSortReversed ?? prev);
    },
  });

  const [sortOption, setSortOption] = React.useState<ChapterSortOption>(
    ChapterSortOption.CHAPTER_NUMBER,
  );
  const [reversed, toggleReversed] = useBoolean();

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
