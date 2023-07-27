'use client';
import Button from '@app/components/Button';
import Text from '@app/components/Text';
import React from 'react';
import { MdFilterList } from 'react-icons/md';

interface ChaptersHeaderProps {
  chaptersLen: number;
  onOpenFilters: () => void;
}

export default function ChaptersHeader(props: ChaptersHeaderProps) {
  const { chaptersLen, onOpenFilters } = props;

  return (
    <div className="flex flex-row justify-between gap-2 items-center">
      <Text variant="header">
        {chaptersLen} Chapter
        {chaptersLen !== 1 ? 's' : ''}
      </Text>
      <Button onPress={onOpenFilters} icon={<MdFilterList />}>
        Filters
      </Button>
    </div>
  );
}
