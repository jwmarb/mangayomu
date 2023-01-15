import { Divider, Flex, Icon, Spacer, Typography } from '@components/core';
import React from 'react';

const DownloadManagerEmpty: React.FC = (props) => {
  return (
    <Flex container horizontalPadding={3} justifyContent='center' alignItems='center' direction='column' fullHeight>
      <Typography variant='header' align='center'>
        There are no downloads
      </Typography>
      <Spacer y={1} />
      <Typography color='textSecondary' align='center'>
        Ongoing downloads will be shown here
      </Typography>
    </Flex>
  );
};

export default React.memo(DownloadManagerEmpty);
