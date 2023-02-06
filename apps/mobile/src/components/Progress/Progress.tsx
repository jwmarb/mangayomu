import { useTheme } from '@emotion/react';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { ProgressProps } from './Progress.interfaces';

const Progress: React.FC<ProgressProps> = (props) => {
  const { color = 'primary' } = props;
  const theme = useTheme();
  return (
    <ActivityIndicator
      size={moderateScale(32)}
      color={theme.palette[color].main}
    />
  );
};

export default Progress;
