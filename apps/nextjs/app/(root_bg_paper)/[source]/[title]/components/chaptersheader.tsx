'use client';
import Button from '@app/components/Button';
import Text from '@app/components/Text';
import useBoolean from '@app/hooks/useBoolean';
import React from 'react';
import { MdFilterList } from 'react-icons/md';

interface ChaptersHeaderProps {
  expanded: boolean;
  toggleExpanded: ReturnType<typeof useBoolean>[1];
  chaptersLen: number;
}

export default function ChaptersHeader(props: ChaptersHeaderProps) {
  const { expanded, toggleExpanded, chaptersLen } = props;
  return (
    <div className="flex flex-row justify-between gap-2 items-center">
      <Text variant="header">
        {chaptersLen} Chapter
        {chaptersLen !== 1 ? 's' : ''}
      </Text>
      <Button icon={<MdFilterList />}>Filters</Button>
    </div>
  );
}
