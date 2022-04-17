import { Flex, Spacer, Typography } from '@components/core';
import { StatusCircle } from '@screens/Home/screens/MangaViewer/components/StatusIndicator/StatusIndicator.base';
import { StatusIndicatorProps } from '@screens/Home/screens/MangaViewer/components/StatusIndicator/StatusIndicator.interfaces';
import React from 'react';

const StatusIndicator: React.FC<StatusIndicatorProps> = (props) => {
  const { status, loading } = props;
  if (!loading && status)
    return (
      <Flex direction='column'>
        <Flex alignItems='center'>
          <StatusCircle status={status} />
          <Spacer x={1} />
          <Typography variant='body2'>{status.scan}</Typography>
        </Flex>
        <Flex alignItems='center'>
          <StatusCircle status={status} />
          <Spacer x={1} />
          <Typography variant='body2'>{status.publish}</Typography>
        </Flex>
      </Flex>
    );

  return null;
};

export default StatusIndicator;
