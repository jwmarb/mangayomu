import Text from '@app/components/Text';
import React from 'react';

interface AuthorsProps {
  authors?: string[];
}

export default function Authors(props: AuthorsProps) {
  const { authors } = props;
  return (
    <Text color="text-secondary" className="text-center">
      by {authors?.join(', ') ?? 'unknown'}
    </Text>
  );
}
