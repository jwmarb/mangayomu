import Box from '@components/Box';
import { useTheme } from '@emotion/react';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';
import { DividerProps } from './Divider.interfaces';

const DIVIDER_DEPTH = moderateScale(1.5);

const Divider: React.FC<DividerProps> = (props) => {
  const { orientation = 'horizontal' } = props;
  const theme = useTheme();
  return (
    <Box
      background-color={theme.palette.background.disabled}
      {...(orientation === 'horizontal'
        ? { width: '100%', height: DIVIDER_DEPTH }
        : { height: '100%', width: DIVIDER_DEPTH })}
    />
  );
};

export default React.memo(Divider);
