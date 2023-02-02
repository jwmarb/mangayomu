import Badge from '@components/Badge';
import Box from '@components/Box';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import { MangaHost } from '@mangayomu/mangascraper';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { BaseButton } from 'react-native-gesture-handler';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import { BookProps } from './Book.interfaces';
const styles = ScaledSheet.create({
  image: {
    width: '110@ms',
    height: '160@ms',
    borderRadius: '8@ms',
  },
  button: {
    borderRadius: '8@ms',
  },
});

const Book: React.FC<BookProps> = (props) => {
  const { manga } = props;
  return (
    <BaseButton style={styles.button}>
      <Stack space="s" maxWidth={moderateScale(110)}>
        <Badge
          type="image"
          uri={MangaHost.getAvailableSources().get(manga.source)!.getIcon()}
          show
        >
          <FastImage source={{ uri: manga.imageCover }} style={styles.image} />
        </Badge>
        <Text variant="book-title" numberOfLines={2} bold>
          {manga.title}
        </Text>
      </Stack>
    </BaseButton>
  );
};

export default Book;
