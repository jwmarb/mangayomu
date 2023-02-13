import Box from '@components/Box';
import Icon from '@components/Icon';
import Skeleton from '@components/Skeleton';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import React from 'react';
import { MangaRatingProps } from './MangaRating.interfaces';

const MangaRating: React.FC<MangaRatingProps> = (props) => {
  const { data, loading } = props;

  if (data == null && loading)
    return (
      <Box align-self="center">
        <Skeleton>
          <Box
            flex-direction="row"
            align-items="center"
            justify-content="center"
          >
            <Icon color="disabled" type="font" name="star" variant="header" />
            <Icon color="disabled" type="font" name="star" variant="header" />
            <Icon color="disabled" type="font" name="star" variant="header" />
            <Icon color="disabled" type="font" name="star" variant="header" />
            <Icon color="disabled" type="font" name="star" variant="header" />
            <Box ml="s">
              <Text variant="book-title" color="textSecondary">
                Placeholder
              </Text>
            </Box>
          </Box>
        </Skeleton>
      </Box>
    );

  if (data == null) return null;

  const { value, voteCount } = data;

  if (typeof value === 'string')
    return (
      <Box flex-direction="row" align-items="center" justify-content="center">
        <Icon color="disabled" type="font" name="star" variant="header" />
        <Icon color="disabled" type="font" name="star" variant="header" />
        <Icon color="disabled" type="font" name="star" variant="header" />
        <Icon color="disabled" type="font" name="star" variant="header" />
        <Icon color="disabled" type="font" name="star" variant="header" />
        <Box ml="s">
          <Text variant="book-title" color="textSecondary">
            N/A ({data.voteCount} votes)
          </Text>
        </Box>
      </Box>
    );
  return (
    <Box flex-direction="row" align-items="center" justify-content="center">
      {new Array(5).fill('').map((x, i) => {
        const star = i;
        const converted = value / 2; // Converts to # out of 5 rating
        const netDifference = converted - star;
        if (netDifference >= 1)
          return <Icon key={i} type="font" name="star" color="primary" />;
        if (netDifference <= 0)
          return <Icon key={i} type="font" name="star" color="disabled" />;

        return (
          <Box key={i} align-items="center" justify-content="center">
            <Icon type="font" name="star" color="disabled" />
            <Box position="absolute" width={netDifference * 100 + '%'}>
              <Icon type="font" name="star" color="primary" />
            </Box>
          </Box>
        );
      })}
      <Stack space="s" ml="s" flex-direction="row" align-items="center">
        <Text variant="book-title" color="primary">
          {value.toFixed(1)}
        </Text>
        <Text variant="book-title" color="textSecondary">
          •
        </Text>
        <Text variant="book-title" color="textSecondary">
          {voteCount} vote{voteCount > 1 && 's'}
        </Text>
      </Stack>
    </Box>
  );
};

export default React.memo(MangaRating);