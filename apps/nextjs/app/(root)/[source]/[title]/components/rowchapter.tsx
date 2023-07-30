'use client';
import Text from '@app/components/Text';
import getSlug from '@app/helpers/getSlug';
import { MangaChapter } from '@mangayomu/mangascraper';
import { format, formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface RowChapterProps {
  chapter: MangaChapter;
  isLastItem: boolean;
}

function RowChapter(props: RowChapterProps) {
  const pathName = usePathname();
  const { chapter, isLastItem } = props;
  const { name, date } = chapter;
  const parsed = Date.parse(date);
  const isRecent = Date.now() - 6.048e7 < parsed;
  const isWithinWeek = Date.now() - 6.048e8 < parsed;
  const formattedDate = isWithinWeek
    ? formatDistanceToNow(parsed, { addSuffix: true })
    : format(parsed, 'MMMM dd, yyyy');
  return (
    <Link
      href={pathName + '/' + getSlug(chapter.name)}
      className={`px-4 py-2 hover:bg-hover active:bg-pressed transition duration-250 bg-default ${
        !isLastItem ? 'border-b-2 border-default' : ''
      }`}
    >
      <Text>{name}</Text>
      <Text color={isRecent ? 'secondary' : 'text-secondary'}>
        {formattedDate}
      </Text>
    </Link>
  );
}

export default React.memo(RowChapter);
