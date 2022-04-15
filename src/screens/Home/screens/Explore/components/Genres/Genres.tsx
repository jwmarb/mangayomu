import Flex from '@components/Flex';
import Spacer from '@components/Spacer';
import { Typography } from '@components/Typography';
import React from 'react';

const Genres: React.FC = (props) => {
  const {} = props;
  return (
    <Flex>
      <Typography variant='subheader'>Genres</Typography>
      <Spacer y={1} />
    </Flex>
  );
};

export default Genres;
