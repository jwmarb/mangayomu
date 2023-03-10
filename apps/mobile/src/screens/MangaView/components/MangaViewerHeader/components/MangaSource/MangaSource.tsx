import Stack from '@components/Stack';
import Text from '@components/Text';
import React from 'react';
import { MangaSourceProps } from './MangaSource.interfaces';

const MangaSource: React.FC<MangaSourceProps> = (props) => {
  const { mangaSource } = props;
  return (
    <Stack
      flex-direction="row"
      space="s"
      justify-content="space-between"
      align-items="center"
    >
      <Text color="textSecondary">Source</Text>
      <Text bold>{mangaSource}</Text>
    </Stack>
  );
};

export default React.memo(MangaSource);
