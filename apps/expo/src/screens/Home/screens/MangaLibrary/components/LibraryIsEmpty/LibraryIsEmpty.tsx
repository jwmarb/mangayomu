import { Flex, Spacer, Typography } from '@components/core';
import { LibraryIsEmptyContainer } from '@screens/Home/screens/MangaLibrary/components/LibraryIsEmpty/LibraryIsEmpty.base';
import React from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';

const LibraryIsEmpty: React.FC = (props) => {
  return (
    <LibraryIsEmptyContainer>
      <Flex shrink direction='column'>
        <Typography variant='header' align='center'>
          Your library is empty :(
        </Typography>
        <Spacer y={1} />
        <Typography color='textSecondary' align='center'>
          To save a manga and receive updates, add it to your library here
        </Typography>
      </Flex>
    </LibraryIsEmptyContainer>
  );
};

export default React.memo(LibraryIsEmpty);
