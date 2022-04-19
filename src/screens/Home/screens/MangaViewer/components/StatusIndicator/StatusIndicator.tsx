import { Flex, Skeleton, Spacer, Typography } from '@components/core';
import { StatusCircle } from '@screens/Home/screens/MangaViewer/components/StatusIndicator/StatusIndicator.base';
import { StatusIndicatorProps } from '@screens/Home/screens/MangaViewer/components/StatusIndicator/StatusIndicator.interfaces';
import animate from '@utils/Animations/animate';
import MangaValidator from '@utils/MangaValidator';
import withAnimatedLoading from '@utils/Animations/withAnimatedLoading';
import withAnimatedMounting from '@utils/Animations/withAnimatedMounting';
import React from 'react';

const StatusIndicator: React.FC<StatusIndicatorProps> = (props) => {
  const { meta, loading } = props;
  if (meta && MangaValidator.hasStatus(meta)) {
    const { status } = meta;
    return (
      <Flex direction='column'>
        {!loading && status
          ? animate(
              <>
                <Flex alignItems='center'>
                  <StatusCircle publish={status.publish} />
                  <Spacer x={1} />
                  <Typography variant='body2'>{status.publish}</Typography>
                </Flex>
                {status.scan && (
                  <Flex alignItems='center'>
                    <StatusCircle scan={status.scan} />
                    <Spacer x={1} />
                    <Typography variant='body2'>{status.scan}</Typography>
                  </Flex>
                )}
              </>,
              withAnimatedMounting
            )
          : animate(
              <>
                <Skeleton.Typography width='100%' variant='body2' />
                <Spacer y={1} />
                <Skeleton.Typography width='100%' variant='body2' />
              </>,
              withAnimatedLoading
            )}
      </Flex>
    );
  }

  return animate(
    <>
      <Skeleton.Typography width='100%' />
      <Spacer y={1} />

      <Skeleton.Typography width='100%' />
    </>,
    withAnimatedLoading
  );
};

export default React.memo(StatusIndicator);
