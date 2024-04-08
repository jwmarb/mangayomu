import { View } from 'react-native';
import React from 'react';
import Icon from '@/components/primitives/Icon';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import useMangaViewData from '@/screens/MangaView/hooks/useMangaViewData';
import { createStyles } from '@/utils/theme';

export type StarsProps = {
  rating: number;
};

const styles = createStyles((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: theme.style.size.m,
  },
  partialStar: {
    position: 'absolute',
  },
  divider: {
    marginHorizontal: theme.style.size.s,
  },
}));

export default React.memo(function Stars() {
  const data = useMangaViewData();
  const contrast = useContrast();
  const style = useStyles(styles, contrast);

  if (data?.rating != null) {
    const rating = data.rating;
    if (typeof rating.value === 'string') {
      return (
        <View style={style.container}>
          <Icon type="icon" name="star" color="disabled" size="small" />
          <Icon type="icon" name="star" color="disabled" size="small" />
          <Icon type="icon" name="star" color="disabled" size="small" />
          <Icon type="icon" name="star" color="disabled" size="small" />
          <Icon type="icon" name="star" color="disabled" size="small" />
          <Text color="textSecondary" variant="chip" style={style.text}>
            N/A
          </Text>
        </View>
      );
    }
    return (
      <View style={style.container}>
        {new Array(5).fill('').map((x, i) => {
          const star = i;
          const converted = (rating.value as number) / 2; // Converts to # out of 5 rating
          const netDifference = converted - star;
          if (netDifference >= 1)
            return (
              <Icon
                key={i}
                type="icon"
                name="star"
                color="primary"
                size="small"
              />
            );
          if (netDifference <= 0)
            return (
              <Icon
                key={i}
                type="icon"
                name="star"
                color="disabled"
                size="small"
              />
            );

          return (
            <View key={i}>
              <Icon type="icon" name="star" color="disabled" size="small" />
              <Icon
                size="small"
                key={i}
                type="icon"
                name="star"
                color="primary"
                style={[style.partialStar, { width: 10 }]}
              />
            </View>
          );
        })}
        <Text variant="chip" color="textSecondary" style={style.text}>
          {rating.value.toFixed(1)}
        </Text>
        <Text variant="chip" color="textSecondary" style={style.divider}>
          •
        </Text>
        <Text variant="chip" color="textSecondary">
          {rating.voteCount} vote{rating.voteCount > 1 && 's'}
        </Text>
      </View>
    );
  }
  return null;
});
