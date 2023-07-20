import Stack from '@components/Stack/Stack';
import Text from '@components/Text';
import React from 'react';
import {
  renderItem,
  keyExtractor,
  ItemSeparatorComponent,
} from './ContinueReading.flatlist';
import { FlashList } from '@shopify/flash-list';
import { UNFINISHED_MANGA_WIDTH } from '@theme/constants';
import { useTheme } from '@emotion/react';
import { useWindowDimensions } from 'react-native';
import Button from '@components/Button/Button';
import useUnfinishedMangas from '@hooks/useUnfinishedMangas';
import useRootNavigation from '@hooks/useRootNavigation';

const ContinueReading: React.FC = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [unfinishedMangas, p, isNotSynced] = useUnfinishedMangas();
  const navigation = useRootNavigation();
  function handleOnViewAll() {
    navigation.navigate('UnfinishedMangaList');
  }

  if (unfinishedMangas.length === 0 || isNotSynced) return null;

  return (
    <Stack space="s">
      <Stack
        space="s"
        mx="m"
        flex-direction="row"
        justify-content="space-between"
        align-items="center"
      >
        <Text variant="header" bold>
          Continue reading
        </Text>
        {unfinishedMangas.length > 5 && (
          <Button
            label={`View all ${unfinishedMangas.length} mangas`}
            onPress={handleOnViewAll}
          />
        )}
      </Stack>
      <FlashList
        contentContainerStyle={{
          paddingHorizontal: width / 2 - UNFINISHED_MANGA_WIDTH / 2,
        }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        extraData={p}
        estimatedItemSize={UNFINISHED_MANGA_WIDTH}
        overrideItemLayout={(layout) => {
          layout.size = UNFINISHED_MANGA_WIDTH + theme.style.spacing.s * 2;
        }}
        horizontal
        data={unfinishedMangas.slice(0, 5)}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparatorComponent}
        snapToInterval={UNFINISHED_MANGA_WIDTH + theme.style.spacing.s * 2}
        decelerationRate="fast"
      />
    </Stack>
  );
};

export default React.memo(ContinueReading);
