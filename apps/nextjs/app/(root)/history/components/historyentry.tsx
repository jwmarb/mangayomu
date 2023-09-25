import Book from '@app/components/Book';
import Text from '@app/components/Text';
import getMangaHost from '@app/helpers/getMangaHost';
import getSlug from '@app/helpers/getSlug';
import isMultilingualChapter from '@app/helpers/isMultilingualChapter';
import {
  ISourceChapterSchema,
  ISourceMangaSchema,
  IUserHistorySchema,
} from '@mangayomu/schemas';
import { format } from 'date-fns';
import Link from 'next/link';
import React from 'react';

export interface HistoryEntryProps {
  entry: IUserHistorySchema;
  manga: ISourceMangaSchema;
  chapter: ISourceChapterSchema;
}

function HistoryEntry(props: HistoryEntryProps) {
  const { manga, chapter, entry: x } = props;
  const host = getMangaHost(manga.source);
  return (
    <Link
      href={`/${getSlug(manga.source)}/${getSlug(manga.title)}/${
        getSlug(chapter.name) +
        '-' +
        (isMultilingualChapter(chapter)
          ? chapter.language
          : host.defaultLanguage)
      }`}
      className="flex flex-row items-center gap-2 px-4 cursor-pointer hover:bg-hover active:bg-pressed transition duration-150"
    >
      <div>
        <Book.Cover manga={manga} standalone compact />
      </div>
      <div className="flex flex-col">
        <Text className="font-bold" variant="book-title">
          {manga.title}
        </Text>
        <div className="flex flex-row gap-2">
          <Text color="text-secondary">{chapter.name}</Text>
          <Text color="text-secondary">•</Text>
          <Text className="font-bold" color="text-secondary">
            {format(x.date, 'h:mm a')}
          </Text>
        </div>
      </div>
    </Link>
  );
}

export default React.memo(HistoryEntry);
