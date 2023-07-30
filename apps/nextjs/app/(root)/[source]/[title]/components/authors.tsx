import Text from '@app/components/Text';
import React from 'react';

interface AuthorsProps {
  authors?: string[] | null;
}

export default function Authors(props: AuthorsProps) {
  const { authors } = props;
  if (authors == null) return <Text.Skeleton width="100%" />;
  return (
    <Text color="text-secondary" className="text-center">
      by {authors.length > 0 ? authors.join(', ') : 'unknown'}
    </Text>
  );
}
