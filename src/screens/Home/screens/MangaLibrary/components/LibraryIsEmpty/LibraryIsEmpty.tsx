import { Flex, Spacer, Typography } from '@components/core';
import React from 'react';

const LibraryIsEmpty: React.FC = (props) => {
  return (
    <Flex container grow verticalPadding={3} justifyContent='center' alignItems='center' horizontalPadding={3}>
      <Flex shrink direction='column'>
        <Typography variant='header' align='center'>
          Your library is empty :(
        </Typography>
        <Spacer y={1} />
        <Typography color='textSecondary' align='center'>
          To save a manga and receive updates, add it to your library here
        </Typography>
      </Flex>
    </Flex>
  );
};

export default React.memo(LibraryIsEmpty);
