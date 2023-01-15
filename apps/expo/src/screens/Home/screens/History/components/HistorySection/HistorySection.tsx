import { Typography } from '@components/Typography';
import { HistorySectionContainer } from '@screens/Home/screens/History/components/HistorySection/HistorySection.base';
import React from 'react';
import { HistorySectionProps } from './HistorySection.interfaces';

const HistorySection: React.FC<HistorySectionProps> = (props) => {
  const { title } = props;
  return (
    <HistorySectionContainer>
      <Typography variant='subheader'>{title}</Typography>
    </HistorySectionContainer>
  );
};

export default React.memo(HistorySection);
