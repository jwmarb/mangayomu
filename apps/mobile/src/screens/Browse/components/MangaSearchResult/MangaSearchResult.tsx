import Box from '@components/Box';
import Button from '@components/Button';
import Progress from '@components/Progress';
import Stack from '@components/Stack';
import { useTheme } from '@emotion/react';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import connector, {
  ConnectedMangaSearchResultProps,
} from './MangaSearchResult.redux';
import { bookDimensions } from '@components/Book';
import {
  renderItem,
  keyExtractor,
  MangaSeparator,
} from '@screens/Explore/Explore.flatlist';
import Text from '@components/Text';
import Icon from '@components/Icon';
import useRootNavigation from '@hooks/useRootNavigation';
const MangaSearchResult: React.FC<ConnectedMangaSearchResultProps> = (
  props,
) => {
  const { status, mangas, error, source } = props;
  const theme = useTheme();
  const navigation = useRootNavigation();
  function handleOnMore() {
    navigation.navigate('InfiniteMangaList', { source });
  }
  return (
    <Stack space="s">
      <Stack
        flex-direction="row"
        space="s"
        justify-content="space-between"
        align-items="center"
        mx="m"
      >
        <Stack flex-direction="row" space="m" align-items="center">
          <Text variant="header">{source}</Text>
          {status === 'loading' && (
            <Animated.View entering={FadeIn} exiting={FadeOut}>
              <Progress size="small" />
            </Animated.View>
          )}
          {status === 'failed_with_errors' && (
            <Animated.View entering={FadeIn} exiting={FadeOut}>
              <Icon type="font" name="alert-circle" color="error" />
            </Animated.View>
          )}
        </Stack>
        {status === 'done' && (
          <Box
            pointerEvents={mangas.length > 9 ? 'auto' : 'none'}
            opacity={mangas.length > 9 ? 1 : 0}
          >
            <Button label="See More" onPress={handleOnMore} />
          </Box>
        )}
      </Stack>
      {status === 'done' && (
        <FlashList
          contentContainerStyle={{
            paddingHorizontal: theme.style.spacing.m,
          }}
          data={mangas.slice(0, 9)}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={MangaSeparator}
          estimatedItemSize={bookDimensions.height}
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      )}
      {status === 'failed_with_errors' && (
        <Box mx="m">
          <Text color="error">{error}</Text>
        </Box>
      )}
    </Stack>
  );
};

export default connector(React.memo(MangaSearchResult));
