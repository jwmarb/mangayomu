import Flex from '@components/Flex';
import MangaSkeleton from '@components/Manga/Manga.skeleton';
import React from 'react';

const placeholders = new Array(10).fill('').map((_, i) => <MangaSkeleton key={i} />);

const MangaPlaceholder: React.FC = () => {
  return <Flex spacing={2}>{placeholders}</Flex>;
};

export default MangaPlaceholder;
