import { Divider } from '@components/Divider';
import Flex from '@components/Flex';
import { Typography } from '@components/Typography';
import React from 'react';

const MenuTitle: React.FC = (props) => {
  const { children } = props;
  return (
    <>
      <Flex alignItems='center' justifyContent='center' container verticalPadding={1}>
        <Typography color='textSecondary' variant='body2'>
          {children}
        </Typography>
      </Flex>
      <Divider />
    </>
  );
};

export default MenuTitle;
