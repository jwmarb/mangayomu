import BackgroundColor from '@app/(root)/settings/components/reader_components/BackgroundColor';
import ReadingDirection from '@app/(root)/settings/components/reader_components/ReadingDirection';
import Text from '@app/components/Text';
import React from 'react';

export default function Reader() {
  return (
    <>
      <div className="mx-4">
        <Text variant="header">Reader</Text>
        <Text color="text-secondary">Customize the reader</Text>
      </div>
      <BackgroundColor />
      <ReadingDirection />
    </>
  );
}
