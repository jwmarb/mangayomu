import Box from '@components/Box';
import Text from '@components/Text';
import { format } from 'date-fns';
import React from 'react';
import { SectionHeaderProps } from './SectionHeader.interfaces';

const SectionHeader: React.FC<SectionHeaderProps> = (props) => {
  const { date } = props;
  return (
    <Box p="m">
      <Text bold color="textSecondary">
        {format(date, 'MMM d, yyyy')}
      </Text>
    </Box>
  );
};

export default React.memo(SectionHeader);
