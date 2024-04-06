import React from 'react';
import Text from '@/components/primitives/Text';
import useMangaViewFetchStatus from '@/screens/MangaView/hooks/useMangaViewFetchStatus';

export type AuthorsProps = {
  authors?: string[];
};

export default React.memo(function Authors({ authors }: AuthorsProps) {
  const status = useMangaViewFetchStatus();
  if (authors != null)
    return <Text color="textSecondary">By {authors.join(', ')}</Text>;

  if (status === 'pending') {
    return <Text.Skeleton />;
  }
  return null;
});
