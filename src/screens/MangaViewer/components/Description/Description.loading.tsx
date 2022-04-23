import { Button, Skeleton, Typography } from '@components/core';
import Flex from '@components/Flex';
import useAnimatedLoading from '@hooks/useAnimatedLoading';
import Animated from 'react-native-reanimated';
import React from 'react';

const LoadingDescription: React.FC = (props) => {
  const {} = props;
  const loading = useAnimatedLoading();
  return (
    <Animated.View style={loading}>
      <Flex spacing={1} direction='column'>
        <Skeleton.Typography width='100%' />
        <Skeleton.Typography width='100%' />
        <Skeleton.Typography width='100%' />
        <Skeleton.Typography width='80%' />
      </Flex>
    </Animated.View>
  );
};

export default LoadingDescription;
