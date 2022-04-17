import { Flex, MangaCover, Skeleton, Spacer, Typography } from '@components/core';
import useAnimatedMounting from '@hooks/useAnimatedMounting';
import { Authors } from '@screens/Home/screens/MangaViewer/components/Authors/Authors.interfaces';
import MangaValidator from '@utils/MangaValidator';
import React from 'react';
import Animated from 'react-native-reanimated';

const Title: React.FC<Authors> = (props) => {
  const { manga, authors, loading } = props;
  const animatedMount = useAnimatedMounting(!loading);
  return MangaValidator.hasAuthors(manga) ? (
    <Typography>
      By <Typography color='textSecondary'>{manga.authors.join(', ')}</Typography>
    </Typography>
  ) : loading ? (
    <Skeleton.Typography width='80%' />
  ) : (
    <Animated.View style={animatedMount}>
      <Typography>
        By <Typography color='textSecondary'>{authors?.join(', ')}</Typography>
      </Typography>
    </Animated.View>
  );
};

export default React.memo(Title);
