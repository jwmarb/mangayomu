import Box from '@components/Box';
import Stack from '@components/Stack';
import Tag from '@components/Tag';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import integrateSortedList from '@helpers/integrateSortedList';
import useMangaHost from '@hooks/useMangaHost';
import { StringComparator } from '@mangayomu/algorithms';
import React from 'react';
import { ListRenderItem } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
const ItemSeparatorComponent = React.memo(() => <Box m={moderateScale(4)} />);
const GenresList: React.FC = () => {
  const source = useMangaHost();
  const genres = React.useMemo(() => {
    const collection = source.getRawGenres();
    const uniq = new Set<string>();
    for (const source in collection) {
      for (const genre of collection[source]) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        uniq.add(genre);
      }
    }
    const uniqArr: string[] = [];
    for (const genre of uniq) {
      integrateSortedList(uniqArr, StringComparator).add(genre);
    }
    return uniqArr;
  }, [source.getSourcesLength()]);
  const theme = useTheme();
  const scrollViewStyles = React.useMemo(
    () => ({ paddingHorizontal: theme.style.spacing.m }),
    [],
  );
  return (
    <Stack space="s">
      <Box mx="m">
        <Text variant="header" bold>
          Genres
        </Text>
      </Box>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <Box mx={-theme.style.spacing.s}>
          <FlatList
            data={genres}
            contentContainerStyle={scrollViewStyles}
            ItemSeparatorComponent={ItemSeparatorComponent}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={Math.ceil(genres.length / 3)}
            key={genres.length}
          />
        </Box>
      </ScrollView>
    </Stack>
  );
};

const renderItem: ListRenderItem<string> = ({ item }) => <Item item={item} />;
const Item: React.FC<{ item: string }> = React.memo(({ item }) => {
  return (
    <Box ml="s">
      <Tag label={item} />
    </Box>
  );
});
const keyExtractor = (i: string) => i;

export default GenresList;
