import Box from '@components/Box';
import Icon from '@components/Icon';
import { Stack } from '@components/Stack';
import Tag from '@components/Tag';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import integrateSortedList from '@helpers/integrateSortedList';
import { StringComparator } from '@mangayomu/algorithms';
import { MangaHost } from '@mangayomu/mangascraper';
import React from 'react';
import { ListRenderItem } from 'react-native';
import {
  BaseButton,
  BorderlessButton,
  FlatList,
  ScrollView,
} from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import connector, { ConnectedGenresListProps } from './GenresList.redux';
const ItemSeparatorComponent = React.memo(() => <Box m={moderateScale(4)} />);
const GenresList: React.FC<ConnectedGenresListProps> = (props) => {
  const { source } = props;
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
        <FlatList
          data={genres}
          contentContainerStyle={scrollViewStyles}
          ItemSeparatorComponent={ItemSeparatorComponent}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={Math.ceil(genres.length / 3)}
          key={genres.length}
        />
      </ScrollView>
    </Stack>
  );
};

const renderItem: ListRenderItem<string> = ({ item }) => (
  <Tag
    // icon={
    //   <Icon
    //     type="image"
    //     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //     name={MangaHost.getAvailableSources().get(item.source)!.getIcon()}
    //     size={moderateScale(18)}
    //   />
    // }
    label={item}
  />
);
const keyExtractor = (i: string) => i;

export default connector(GenresList);
