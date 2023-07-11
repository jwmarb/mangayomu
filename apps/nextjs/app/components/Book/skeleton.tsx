import Text from '@app/components/Text';
import React from 'react';

export default function Skeleton() {
  return (
    <div className="flex flex-col items-start w-[7rem] sm:w-[7.5rem] md:w-[8.5rem] gap-2 p-2">
      <div className="w-full md:h-[10.5rem] sm:h-[9.26471rem] h-[8.64706rem] skeleton rounded-lg" />
      <Text.Skeleton
        variant="book-title"
        numberOfLines={2}
        classNames={['w-full', 'w-[66%]']}
      />
    </div>
  );
}
