'use client';
import Text from '@app/components/Text';
import React from 'react';

interface GenreProps {
  genre: string;
  error?: boolean;
}

export default function Genre(props: GenreProps) {
  const { genre, error } = props;
  return (
    <button className="bg-tag px-3 py-1.5 rounded-full hover:bg-hoverduration-250 transition focus:bg-hover focus:outline focus:outline-2 focus:outline-primary/[.3]">
      <Text
        className="font-normal text-sm tracking-tight"
        color={error ? 'error' : 'text-primary'}
      >
        {genre}
      </Text>
    </button>
  );
}
