import Text from '@app/components/Text';
import React from 'react';

interface MangaSourceProps {
  source: string;
}

export default function MangaSource(props: MangaSourceProps) {
  const { source } = props;
  return (
    <div className="flex flex-row justify-between gap-2">
      <Text color="text-secondary">Source</Text>
      <Text className="font-medium">{source}</Text>
    </div>
  );
}
