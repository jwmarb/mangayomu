import Box from '@components/Box';
import Text from '@components/Text';
import React from 'react';
import { SectionHeaderProps } from './SectionHeader.interfaces';

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <Box mx="m" my="s">
      <Text variant="header" color="textSecondary" bold>
        {title}
      </Text>
    </Box>
  );
};

export default React.memo(SectionHeader);
