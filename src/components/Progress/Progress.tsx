import Flex from '@components/Flex';
import { ProgressCircle } from '@components/Progress/Progress.base';
import { ProgressProps } from '@components/Progress/Progress.interfaces';
import { Color } from '@theme/core';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const Progress: React.FC<ProgressProps> = (props) => {
  const { color = 'primary', size = 'medium' } = props;
  const numSize = React.useMemo(() => {
    switch (size) {
      default:
      case 'medium':
        return RFValue(20);
      case 'large':
        return RFValue(32);
      case 'small':
        return RFValue(14);
    }
  }, [size]);
  return <ActivityIndicator color={Color.valueOf(color)} size={numSize} />;
};

export default Progress;
