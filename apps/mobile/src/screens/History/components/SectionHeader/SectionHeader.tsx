import Box from '@components/Box';
import Text from '@components/Text';
import { format } from 'date-fns';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';
import { SectionHeaderProps } from './SectionHeader.interfaces';

export const MANGA_HISTORY_SECTION_HEADER_HEIGHT = moderateScale(50);

const SectionHeader: React.FC<SectionHeaderProps> = (props) => {
  const { date } = props;
  return (
    <Box p="m" height={MANGA_HISTORY_SECTION_HEADER_HEIGHT}>
      <Text bold color="textSecondary">
        {format(date, 'MMM d, yyyy')}
      </Text>
    </Box>
  );
};

export default React.memo(SectionHeader);
