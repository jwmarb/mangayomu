import Box from '@components/Box';
import Skeleton from '@components/Skeleton';
import Text from '@components/Text';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';
import { MangaAuthorsProps } from './MangaAuthors.interfaces';

const MangaAuthors: React.FC<MangaAuthorsProps> = (props) => {
  const { data, loading } = props;
  if (data == null && loading)
    return (
      <Skeleton fullWidth>
        <Text>Placeholder</Text>
      </Skeleton>
    );

  return (
    <Box maxWidth={moderateScale(420)} align-self="center">
      <Text color="textSecondary">
        by{' '}
        {data == null
          ? 'unknown'
          : data.length > 0
          ? data.join(', ')
          : 'unknown'}
      </Text>
    </Box>
  );
};

export default React.memo(MangaAuthors);
