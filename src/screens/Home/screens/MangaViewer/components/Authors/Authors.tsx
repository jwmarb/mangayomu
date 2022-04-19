import { Flex, MangaCover, Skeleton, Spacer, Typography } from '@components/core';
import useAnimatedMounting from '@hooks/useAnimatedMounting';
import { AuthorsProps } from '@screens/Home/screens/MangaViewer/components/Authors/Authors.interfaces';
import animate from '@utils/animate';
import MangaValidator from '@utils/MangaValidator';
import withAnimatedLoading from '@utils/Animations/withAnimatedLoading';
import React from 'react';
import Animated from 'react-native-reanimated';

const Authors: React.FC<AuthorsProps> = (props) => {
  const { manga, authors, loading } = props;
  const animatedMount = useAnimatedMounting(!loading);
  return MangaValidator.hasAuthors(manga) ? (
    <Typography>
      By{' '}
      <Typography color='textSecondary' numberOfLines={1}>
        {manga.authors.join(', ')}
      </Typography>
    </Typography>
  ) : loading ? (
    animate(<Skeleton.Typography width='80%' />, withAnimatedLoading)
  ) : (
    <Animated.View style={animatedMount}>
      <Typography>
        By{' '}
        <Typography color='textSecondary' numberOfLines={1}>
          {authors?.join(', ')}
        </Typography>
      </Typography>
    </Animated.View>
  );
};

export default React.memo(Authors);
