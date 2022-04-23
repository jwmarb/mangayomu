import { Category, Flex, Genre, Skeleton, Typography } from '@components/core';
import useAnimatedMounting from '@hooks/useAnimatedMounting';
import { GenresProps } from '@screens/MangaViewer/components/Genres/Genres.interfaces';
import animate from '@utils/Animations/animate';
import withAnimatedLoading from '@utils/Animations/withAnimatedLoading';
import withAnimatedMounting from '@utils/Animations/withAnimatedMounting';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';

const Genres: React.FC<GenresProps> = (props) => {
  const { genres, loading, buttons } = props;
  return loading || !genres
    ? buttons
      ? null
      : animate(<Skeleton.Typography width='100%' />, withAnimatedLoading)
    : animate(
        buttons ? (
          <Category.Header>
            <Flex spacing={1}>
              {genres.map((genre) => (
                <Genre key={genre} genre={genre} />
              ))}
            </Flex>
          </Category.Header>
        ) : (
          <Typography color='textSecondary' numberOfLines={2}>
            {genres.join(' · ')}
          </Typography>
        ),
        withAnimatedMounting
      );
};

export default React.memo(Genres);
