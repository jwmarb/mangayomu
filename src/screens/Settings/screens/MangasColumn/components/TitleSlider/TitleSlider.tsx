import { Flex, Typography } from '@components/core';
import React from 'react';

const TitleSlider: React.FC = (props) => {
  const {} = props;
  return (
    <Flex direction='column'>
      <Typography>Title size</Typography>
      <Typography variant='body2' color='textSecondary'>
        Change the size of the title under the manga cover
      </Typography>
    </Flex>
  );
};

export default React.memo(TitleSlider);
