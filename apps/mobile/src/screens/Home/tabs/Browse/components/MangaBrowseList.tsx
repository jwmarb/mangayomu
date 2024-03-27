import React from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  FadeIn,
  FadeInLeft,
  SequencedTransition,
} from 'react-native-reanimated';
import Manga from '@/components/composites/Manga';
import Text, { AnimatedText } from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';
import Button from '@/components/primitives/Button';
import {
  BrowseQueryResult,
  useMangaQuery,
} from '@/screens/Home/tabs/Browse/Browse';
import Source from '@/screens/Home/tabs/Sources/components/Source';
import { getErrorMessage } from '@/utils/helpers';
import { AnimatedProgress } from '@/components/primitives/Progress';
import { AnimatedIcon } from '@/components/primitives/Icon';

const styles = createStyles((theme) => ({
  title: {
    flexDirection: 'row',
    gap: theme.style.size.m,
    paddingHorizontal: theme.style.screen.paddingHorizontal,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftTitleContainer: {
    flexDirection: 'row',
    gap: theme.style.size.m,
    alignItems: 'center',
  },
  container: {
    gap: theme.style.size.s,
  },
  emptyResultContainer: {
    paddingHorizontal: theme.style.screen.paddingHorizontal,
  },
}));

type MangaBrowseList = {
  browseQueryResult: BrowseQueryResult;
  // source: MangaSource;
  // mangas: unknown[];
};

const { ListEmptyComponent, getItemLayout, renderItem, keyExtractor } =
  Manga.generateFlatListProps({ horizontal: true });

function ListEmptyResultComponent() {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  return (
    <Text style={style.emptyResultContainer} color="textSecondary">
      No results found
    </Text>
  );
}

function MangaBrowseList(props: MangaBrowseList) {
  const { browseQueryResult } = props;
  const navigation = useNavigation();
  const contrast = useContrast();
  const query = useMangaQuery();
  const style = useStyles(styles, contrast);
  const data =
    (browseQueryResult.data != null &&
      browseQueryResult.data.pages.length > 0 &&
      browseQueryResult.data.pages[0].mangas) ||
    [];
  const isEmptyResults = browseQueryResult.isFetched && data.length === 0;

  function handleOnPress() {
    const source =
      browseQueryResult.data?.pages[0].source.NAME ??
      browseQueryResult.error?.source.NAME;
    if (source == null) return;

    navigation.navigate('SourceBrowser', {
      source,
      initialQuery: query,
    });
  }

  if (
    browseQueryResult.data != null &&
    browseQueryResult.isPlaceholderData &&
    !browseQueryResult.isFetching &&
    !browseQueryResult.isFetched
  )
    return (
      <Source source={browseQueryResult.data.pages[0].source} showPin={false} />
    );

  return (
    <View style={style.container}>
      <View style={style.title}>
        <Animated.View
          layout={SequencedTransition}
          style={style.leftTitleContainer}
        >
          {browseQueryResult.isFetching && (
            <AnimatedProgress entering={FadeInLeft} />
          )}
          {browseQueryResult.isError && (
            <AnimatedIcon
              entering={FadeInLeft}
              type="icon"
              name="exclamation-thick"
              color="error"
            />
          )}
          <Text variant="h4">
            {browseQueryResult.data?.pages[0].source.NAME ??
              browseQueryResult.error?.source.NAME}
          </Text>
          {data.length > 0 && (
            <AnimatedText
              entering={FadeIn}
              variant="body2"
              color="textSecondary"
            >
              ({data.length} result{data.length !== 1 ? 's' : ''})
            </AnimatedText>
          )}
        </Animated.View>
        <Button title="See More" onPress={handleOnPress} />
      </View>
      {browseQueryResult.error != null && (
        <Text
          style={style.emptyResultContainer}
          color="textSecondary"
          variant="body2"
        >
          {getErrorMessage(browseQueryResult.error.error)}
        </Text>
      )}
      {browseQueryResult.data != null && (
        <Manga.SourceProvider
          source={
            browseQueryResult.data.pages[0].source ??
            browseQueryResult.error?.source.NAME
          }
        >
          <FlatList
            data={data.slice(0, 10)}
            ListEmptyComponent={
              browseQueryResult.isPlaceholderData ? (
                <ListEmptyComponent />
              ) : isEmptyResults ? (
                <ListEmptyResultComponent />
              ) : (
                <ListEmptyComponent />
              )
            }
            getItemLayout={getItemLayout}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </Manga.SourceProvider>
      )}
    </View>
  );
}

export default React.memo(MangaBrowseList);
