import React from 'react';
import Text from '@/components/primitives/Text';
import { useMangaViewFetchStatus } from '@/screens/MangaView/context';

export type AuthorsProps = {
  authors?: string[];
};

export default function Authors({ authors }: AuthorsProps) {
  const status = useMangaViewFetchStatus();
  if (authors != null)
    return <Text color="textSecondary">By {authors.join(', ')}</Text>;

  if (status === 'fetching') {
    return <Text.Skeleton />;
  }
  return null;
}
