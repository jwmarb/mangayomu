import Box from '@components/Box';
import { useTheme } from '@emotion/react';
import React from 'react';
import { DividerProps } from './Divider.interfaces';
import { DIVIDER_DEPTH } from '@theme/constants';

const Divider: React.FC<DividerProps> = (props) => {
  const { orientation = 'horizontal' } = props;
  const theme = useTheme();
  return (
    <Box
      background-color={theme.palette.borderColor}
      {...(orientation === 'horizontal'
        ? { width: '100%', height: DIVIDER_DEPTH }
        : { height: '100%', width: DIVIDER_DEPTH })}
    />
  );
};

export default React.memo(Divider);
