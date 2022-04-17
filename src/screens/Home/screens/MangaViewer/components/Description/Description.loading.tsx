import { Button, Skeleton, Typography } from '@components/core';
import Flex from '@components/Flex';
import useAnimatedLoading from '@hooks/useAnimatedLoading';
import Animated from 'react-native-reanimated';
import React from 'react';

const LoadingDescription: React.FC = (props) => {
  const {} = props;
  const loading = useAnimatedLoading();
  return (
    <Flex spacing={1} direction='column'>
      <Animated.View style={loading}>
        <Skeleton.Typography width='100%' />
        <Skeleton.Typography width='100%' />
        <Skeleton.Typography width='100%' />
        <Skeleton.Typography width='80%' />
      </Animated.View>
    </Flex>
  );
};

export default LoadingDescription;
