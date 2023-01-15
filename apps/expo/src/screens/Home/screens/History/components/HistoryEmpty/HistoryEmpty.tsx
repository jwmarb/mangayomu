import Flex from '@components/Flex';
import { Typography, Spacer } from '@components/core';
import { HistoryEmptyContainer } from '@screens/Home/screens/History/components/HistoryEmpty/HistoryEmpty.base';
import React from 'react';

const HistoryEmpty: React.FC = (props) => {
  const {} = props;
  return (
    <HistoryEmptyContainer>
      <Flex shrink direction='column'>
        <Typography variant='header' align='center'>
          Your history is empty
        </Typography>
        <Spacer y={1} />
        <Typography color='textSecondary' align='center'>
          Mangas you read will appear here
        </Typography>
      </Flex>
    </HistoryEmptyContainer>
  );
};

export default React.memo(HistoryEmpty);
