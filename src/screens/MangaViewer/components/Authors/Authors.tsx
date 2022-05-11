import { Flex, MangaCover, Skeleton, Spacer, Typography } from '@components/core';
import useAnimatedMounting from '@hooks/useAnimatedMounting';
import { AuthorsProps } from '@screens/MangaViewer/components/Authors/Authors.interfaces';
import animate from '@utils/Animations/animate';
import MangaValidator from '@utils/MangaValidator';
import withAnimatedLoading from '@utils/Animations/withAnimatedLoading';
import React from 'react';
import Animated from 'react-native-reanimated';

const Authors: React.FC<AuthorsProps> = (props) => {
  const { manga, authors } = props;
  const animatedMount = useAnimatedMounting(!!authors);

  return manga && MangaValidator.hasAuthors(manga) ? (
    <Typography>
      By{' '}
      <Typography color='textSecondary' numberOfLines={1}>
        {manga.authors.join(', ')}
      </Typography>
    </Typography>
  ) : authors === undefined ? (
    animate(<Skeleton.Typography width='80%' />, withAnimatedLoading)
  ) : authors != null ? (
    <Animated.View style={animatedMount}>
      <Typography>
        By{' '}
        <Typography color='textSecondary' numberOfLines={1}>
          {authors?.join(', ')}
        </Typography>
      </Typography>
    </Animated.View>
  ) : null;
};

export default React.memo(Authors);
