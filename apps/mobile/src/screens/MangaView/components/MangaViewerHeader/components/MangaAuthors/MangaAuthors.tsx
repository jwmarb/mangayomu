import Box from '@components/Box';
import Text from '@components/Text';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';
import { MangaAuthorsProps } from './';
import { useMangaViewError } from '@screens/MangaView/context/ErrorContext';

const MangaAuthors: React.FC<MangaAuthorsProps> = (props) => {
  const { data, loading } = props;
  const error = useMangaViewError();
  if (data == null && loading) return <Text.Skeleton />;

  if (error) return null;

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
