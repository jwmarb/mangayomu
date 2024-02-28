import Box from '@components/Box';
import Icon from '@components/Icon';
import Stack from '@components/Stack';
import Text from '@components/Text';
import React from 'react';
import { MangaRatingProps } from './';
import { moderateScale } from 'react-native-size-matters';
import { useMangaViewError } from '@screens/MangaView/context/ErrorContext';

const MangaRating: React.FC<MangaRatingProps> = (props) => {
  const { data, loading } = props;
  const error = useMangaViewError();

  if (data == null && loading)
    return (
      <Box align-self="center">
        <Box flex-direction="row" align-items="center" justify-content="center">
          <Text.Skeleton lineStyles={[{ width: moderateScale(70) }]} />
          <Stack space="s" ml="s" flex-direction="row" align-items="center">
            <Text.Skeleton lineStyles={[{ width: moderateScale(24) }]} />
            <Text variant="book-title" color="textSecondary">
              •
            </Text>
            <Text.Skeleton lineStyles={[{ width: moderateScale(52) }]} />
          </Stack>
        </Box>
      </Box>
    );

  if (data == null || error) return null;

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
