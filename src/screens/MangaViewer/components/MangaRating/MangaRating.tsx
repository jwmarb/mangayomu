import { Flex, Icon, Spacer, Typography } from '@components/core';
import { MangaRatingProps } from '@screens/MangaViewer/components/MangaRating/MangaRating.interfaces';
import React from 'react';

const MangaRating: React.FC<MangaRatingProps> = (props) => {
  const { rating: _rating } = props;
  if (_rating == null) return null;
  const {
    rating: { value, voteCount },
  } = _rating;
  return (
    <>
      {typeof value === 'number' ? (
        <Flex direction='column' alignItems='center' container verticalPadding={1} horizontalPadding={0}>
          <Flex alignItems='center'>
            {new Array(5).fill('').map((x, i) => {
              const star = (i + 1) * 2;
              if (value - star > 1)
                return <Icon key={i} bundle='MaterialCommunityIcons' name='star' color='secondary' />;
              if (value - star >= 0.5)
                return <Icon key={i} bundle='MaterialCommunityIcons' name='star-half-full' color='secondary' />;
              if (value - star < 0.5)
                return <Icon key={i} bundle='MaterialCommunityIcons' name='star-outline' color='secondary' />;
            })}
            <Spacer x={1} />
            <Typography>{value} / 10</Typography>
          </Flex>
          <Typography variant='body2' color='textSecondary'>
            {voteCount} votes
          </Typography>
        </Flex>
      ) : (
        <Flex direction='column' alignItems='center' container>
          <Flex alignItems='center'>
            <Icon bundle='MaterialCommunityIcons' name='star' color='disabled' />
            <Icon bundle='MaterialCommunityIcons' name='star' color='disabled' />
            <Icon bundle='MaterialCommunityIcons' name='star' color='disabled' />
            <Icon bundle='MaterialCommunityIcons' name='star' color='disabled' />
            <Icon bundle='MaterialCommunityIcons' name='star' color='disabled' />
            <Spacer x={1} />
            <Typography>N/A</Typography>
          </Flex>
          <Typography variant='body2' color='textSecondary'>
            {voteCount} votes
          </Typography>
        </Flex>
      )}
    </>
  );
};

export default React.memo(MangaRating);
