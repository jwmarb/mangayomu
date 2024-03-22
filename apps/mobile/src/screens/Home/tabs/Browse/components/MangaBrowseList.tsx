import { MangaSource } from '@mangayomu/mangascraper';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Manga from '@/components/composites/Manga';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { useBrowseStore } from '@/stores/browse';
import { createStyles } from '@/utils/theme';

const styles = createStyles((theme) => ({
  title: {
    flexDirection: 'row',
    gap: theme.style.size.m,
    paddingHorizontal: theme.style.screen.paddingHorizontal,
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
  source: MangaSource;
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
  const { source } = props;
  const contrast = useContrast();
  const result = useBrowseStore((state) => state.searchResults[source.NAME]);
  const style = useStyles(styles, contrast);
  const data = result?.state === 'done' ? result.mangas : [];
  const isEmptyResults = result?.state === 'done' && result.mangas.length === 0;

  return (
    <View style={style.container}>
      <View style={style.title}>
        {result?.state === 'loading' && <ActivityIndicator />}
        <Text variant="h4">{source.NAME}</Text>
        {data.length > 0 && (
          <Text variant="body2" color="textSecondary">
            ({data.length} result{data.length !== 1 ? 's' : ''})
          </Text>
        )}
      </View>
      <Manga.SourceProvider source={source}>
        <FlatList
          data={data.slice(0, 10)}
          ListEmptyComponent={
            isEmptyResults ? <ListEmptyResultComponent /> : ListEmptyComponent
          }
          getItemLayout={getItemLayout}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </Manga.SourceProvider>
    </View>
  );
}

export default React.memo(MangaBrowseList);
