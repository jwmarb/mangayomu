import { RemovedChapter } from '@app/(root)/history/page';
import Book from '@app/components/Book';
import Text from '@app/components/Text';
import { format } from 'date-fns';
import Link from 'next/link';

export interface NotFoundEntryProps {
  removed: RemovedChapter;
}

export default function NotFoundEntry(props: NotFoundEntryProps) {
  const {
    removed: { manga, chapter },
  } = props;
  return (
    <div className="flex flex-row items-center gap-2 px-4">
      <div>
        <Book.Cover manga={manga} standalone compact />
      </div>
      <div className="flex flex-col">
        <Text className="font-bold" variant="book-title">
          {manga.title}
        </Text>
        <div className="flex flex-row gap-2">
          <Text color="error">DELETED</Text>
          <Text color="text-secondary">•</Text>
          <Text color="hint" className="italic">
            {manga.source} no longer hosts this chapter
          </Text>
        </div>
        <Link href={chapter} passHref>
          <Text
            variant="sm-label"
            component="a"
            color="text-secondary"
            className="underline"
          >
            {chapter}
          </Text>
        </Link>
      </div>
    </div>
  );
}
