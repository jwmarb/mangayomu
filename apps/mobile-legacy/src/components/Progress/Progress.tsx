import { useTheme } from '@emotion/react';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { ProgressProps } from './';

const Progress: React.FC<ProgressProps> = (props) => {
  const { color = 'primary', size = 'medium' } = props;
  const theme = useTheme();
  const colorProp = React.useMemo(() => {
    if (color === 'inherit') return undefined;
    return theme.helpers.isPaletteColor(color)
      ? theme.helpers.getColor(color)
      : color;
  }, [color]);
  return (
    <ActivityIndicator
      size={size === 'medium' ? moderateScale(32) : moderateScale(16)}
      color={colorProp}
    />
  );
};

export default Progress;
