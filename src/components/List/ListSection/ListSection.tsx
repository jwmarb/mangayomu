import Flex from '@components/Flex';
import Spacer from '@components/Spacer';
import { Typography } from '@components/Typography';
import React from 'react';
import { ListSectionProps } from './ListSection.interfaces';

const ListSection: React.FC<ListSectionProps> = (props) => {
  const { title } = props;
  return (
    <Flex container verticalPadding={2} horizontalPadding={3}>
      <Spacer x={6.5} />
      <Typography variant='body2' color='primary' bold>
        {title}
      </Typography>
    </Flex>
  );
};

export default ListSection;
