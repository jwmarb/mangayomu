import { Flex, Spacer, Typography } from '@components/core';
import React from 'react';
import { NoItemsFoundProps } from './NoItemsFound.interfaces';

const NoItemsFound: React.FC<NoItemsFoundProps> = (props) => {
  const { query } = props;
  return (
    <Flex grow container verticalPadding={3} alignItems='center' justifyContent='center' horizontalPadding={3}>
      <Flex direction='column' shrink>
        <Typography variant='header' align='center'>
          Not found
        </Typography>
        <Spacer y={1} />
        <Typography color='textSecondary' align='center'>
          There are no mangas in your library that match "{query}"
        </Typography>
      </Flex>
    </Flex>
  );
};

export default React.memo(NoItemsFound);
