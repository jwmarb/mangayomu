import { Skeleton } from '@components/core';
import { LoadingContainer } from '@screens/MangaViewer/components/LoadingChapters/LoadingChapters.base';
import withAnimatedLoading from '@utils/Animations/withAnimatedFadeIn';
import React from 'react';

const LoadingChapters: React.FC = (props) => {
  const {} = props;
  return (
    <LoadingContainer>
      <Skeleton.Chapter />
      <Skeleton.Chapter />
      <Skeleton.Chapter />
    </LoadingContainer>
  );
};

export default withAnimatedLoading(LoadingChapters);
