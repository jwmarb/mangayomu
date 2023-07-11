import Box from '@components/Box';
import { useTheme } from '@emotion/react';
import React from 'react';
import { DividerProps } from './';
import { DIVIDER_DEPTH } from '@theme/constants';

const Divider: React.FC<DividerProps> = (props) => {
  const { orientation = 'horizontal', shrink = false, ...boxProps } = props;
  const theme = useTheme();
  return (
    <Box
      background-color={theme.palette.borderColor}
      {...(orientation === 'horizontal'
        ? {
            width: shrink ? undefined : '100%',
            height: DIVIDER_DEPTH,
            'flex-grow': shrink,
          }
        : {
            height: shrink ? undefined : '100%',
            width: DIVIDER_DEPTH,
            'flex-grow': shrink,
          })}
      {...boxProps}
    />
  );
};

export default React.memo(Divider);
