import Box from '@components/Box';
import { useTheme } from '@emotion/react';
import React from 'react';
import { DividerProps } from './';
import { DIVIDER_DEPTH } from '@theme/constants';

const Divider: React.FC<DividerProps> = (props) => {
  const { orientation = 'horizontal', shrink = false, ...boxProps } = props;
  const theme = useTheme();
  const horizontalProps = {
    width: shrink ? undefined : '100%',
    height: DIVIDER_DEPTH,
    'flex-grow': shrink,
  };
  const verticalProps = {
    height: shrink ? undefined : '100%',
    width: DIVIDER_DEPTH,
    'flex-grow': shrink,
  };
  const styled = orientation === 'horizontal' ? horizontalProps : verticalProps;
  return (
    <Box
      background-color={theme.palette.borderColor}
      {...styled}
      {...boxProps}
    />
  );
};

export default React.memo(Divider);
